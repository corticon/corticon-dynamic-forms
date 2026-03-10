let currentDecisionServiceEngine;
let allInputData = [];
let inputData;
let itsCurrentLanguage = 'english';
let itsQuestionnaireKey = '0';
let itsFlagRenderWithKui = false;
const itsTracer = new Tracer();
const itsStepsController = new corticon.dynForm.StepsController();
const displayOptionsStorageKey = 'CorticonFormsTemplateDisplayOptions';

let lastDecisionExecMs = null;
let lastRenderMs = null;
let lastDsRenderedAtMs = null;

const sampleLabels = {
    0: 'Homeowners Insurance',
    1: 'Job Application',
    2: 'I18N + SCO',
    3: 'Country/State/City',
    4: 'Vehicle Make/Model/Year',
    5: 'Property/Casualty',
    6: 'hhsMarketplace',
    7: 'Foreign Risk',
    8: 'Crossing Form'
};

const stageContracts = {
    0: [
        'Initial stage should set baseline pathToData and the first container.',
        'At least one UI control should be present unless noUiToRenderContinue=true.',
        'nextStageNumber should be deterministic for the same input.'
    ],
    1: [
        'Stage transition should preserve accrued data and append current stage inputs.',
        'Rendered controls should match decision output metadata.',
        'Conditional visibility/required metadata should be honored by the renderer.'
    ],
    2: [
        'Validation metadata should map to active controls (required/min/max/etc.).',
        'pathToData + fieldName must map writes into the intended JSON branch.',
        'nextStageNumber should reflect branch rules for current user input.'
    ],
    999: [
        'Terminal stage should set done=true.',
        'No additional user input should be required.',
        'Trace data should remain available for replay/testing.'
    ]
};

// Make stepsController instance globally accessible if needed elsewhere.
corticon.dynForm.stepsControllerInstance = itsStepsController;

function saveStateToLocalStorage(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (e) {
        console.warn('Could not save to local storage:', e);
    }
}

function processSwitchSample(selectObject) {
    const index = selectObject.value;
    setDataForCurrentSample(index);
    saveStateToLocalStorage('CorticonSelectedSample', index);
}

function setDataForCurrentSample(index) {
    const normalizedIndex = Number(index);
    if (!Number.isInteger(normalizedIndex) || normalizedIndex < 0 || normalizedIndex >= window.corticonEngines.length) {
        return;
    }

    currentDecisionServiceEngine = window.corticonEngines[normalizedIndex];
    inputData = allInputData[normalizedIndex];
    itsQuestionnaireKey = String(normalizedIndex);
}

function processSwitchLanguage(selectObject) {
    itsCurrentLanguage = selectObject.value;
}

function getByPath(rootObj, path) {
    if (!rootObj || !path) return undefined;
    return path.split('.').reduce((acc, part) => (
        acc && Object.prototype.hasOwnProperty.call(acc, part)
    ) ? acc[part] : undefined, rootObj);
}

function isNonEmptyValue(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
}

function computePayloadBytes(payload) {
    try {
        const serialized = JSON.stringify(payload ?? {});
        return new TextEncoder().encode(serialized).length;
    } catch (e) {
        return 0;
    }
}

function formatDelta(current, previous) {
    if (previous === null || previous === undefined || !Number.isFinite(previous)) {
        return { text: '', className: '' };
    }
    const delta = Math.round(current - previous);
    if (delta === 0) {
        return { text: '(no change)', className: '' };
    }
    if (delta > 0) {
        return { text: `( +${delta} ms )`, className: 'positive' };
    }
    return { text: `( ${delta} ms )`, className: 'negative' };
}

function updateDurationMetric(valueElId, deltaElId, currentMs, previousMs) {
    const valueEl = document.getElementById(valueElId);
    const deltaEl = document.getElementById(deltaElId);
    if (!valueEl || !deltaEl) return;

    valueEl.textContent = Number.isFinite(currentMs) ? Math.round(currentMs) : '-';
    deltaEl.classList.remove('positive', 'negative');
    const delta = formatDelta(currentMs, previousMs);
    deltaEl.textContent = delta.text;
    if (delta.className) {
        deltaEl.classList.add(delta.className);
    }
}

function updateBytesMetric(elId, byteCount) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = Number.isFinite(byteCount) ? byteCount.toLocaleString('en-US') : '-';
}

function getDefaultDisplayOptions() {
    return {
        showHints: true,
        showStageContract: true,
        showPerformance: true
    };
}

function readDisplayOptions() {
    const defaults = getDefaultDisplayOptions();
    try {
        const stored = window.localStorage.getItem(displayOptionsStorageKey);
        if (!stored) return defaults;
        const parsed = JSON.parse(stored);
        return {
            showHints: parsed?.showHints !== false,
            showStageContract: parsed?.showStageContract !== false,
            showPerformance: parsed?.showPerformance !== false
        };
    } catch (e) {
        return defaults;
    }
}

function writeDisplayOptions(opts) {
    saveStateToLocalStorage(displayOptionsStorageKey, JSON.stringify(opts));
}

function applyDisplayOptions(opts) {
    const options = {
        showHints: opts?.showHints !== false,
        showStageContract: opts?.showStageContract !== false,
        showPerformance: opts?.showPerformance !== false
    };

    const hintsToggle = document.getElementById('toggleHintsId');
    const stageContractToggle = document.getElementById('toggleStageContractId');
    const performanceToggle = document.getElementById('togglePerformanceId');

    if (hintsToggle) hintsToggle.checked = options.showHints;
    if (stageContractToggle) stageContractToggle.checked = options.showStageContract;
    if (performanceToggle) performanceToggle.checked = options.showPerformance;

    document.body.classList.toggle('hints-disabled', !options.showHints);
    if (!options.showHints) {
        document.querySelectorAll('.help-bubble[open]').forEach((detailEl) => detailEl.removeAttribute('open'));
    }

    const stageContractWidget = document.getElementById('traceContractWidgetId');
    if (stageContractWidget) {
        stageContractWidget.style.display = options.showStageContract ? '' : 'none';
    }

    const performanceWidget = document.getElementById('performanceWidgetZone');
    if (performanceWidget) {
        const traceVisible = $('.allTracesContainer').is(':visible');
        performanceWidget.style.display = options.showPerformance && traceVisible ? '' : 'none';
    }

    writeDisplayOptions(options);
}

function initializeDisplayOptionsControls() {
    const hintsToggle = document.getElementById('toggleHintsId');
    const stageContractToggle = document.getElementById('toggleStageContractId');
    const performanceToggle = document.getElementById('togglePerformanceId');

    if (!hintsToggle || !stageContractToggle || !performanceToggle) {
        return;
    }

    const initial = readDisplayOptions();
    applyDisplayOptions(initial);

    hintsToggle.addEventListener('change', function () {
        applyDisplayOptions({
            ...readDisplayOptions(),
            showHints: this.checked
        });
    });

    stageContractToggle.addEventListener('change', function () {
        applyDisplayOptions({
            ...readDisplayOptions(),
            showStageContract: this.checked
        });
    });

    performanceToggle.addEventListener('change', function () {
        applyDisplayOptions({
            ...readDisplayOptions(),
            showPerformance: this.checked
        });
    });
}

function closeHelpBubblesOnOutsideClick() {
    document.addEventListener('click', (evt) => {
        const insideBubble = evt.target.closest('.help-bubble');
        if (insideBubble) return;
        document.querySelectorAll('.help-bubble[open]').forEach((detailEl) => {
            detailEl.removeAttribute('open');
        });
    });
}

function updateContractPanel(stageNumber) {
    const stageEl = document.getElementById('contractStageId');
    const listEl = document.getElementById('stageContractListId');
    if (!stageEl || !listEl) return;

    const normalizedStage = Number.isFinite(Number(stageNumber)) ? Number(stageNumber) : '-';
    stageEl.textContent = normalizedStage;

    const items = stageContracts[normalizedStage] || [
        'Stage has no explicit contract in this template.',
        'Verify pathToData, rendered controls, and nextStageNumber.',
        'Capture input/output snapshots for deterministic regression tests.'
    ];

    listEl.innerHTML = '';
    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        listEl.appendChild(li);
    });
}

function resolveCurrentStageFromOutput(outputPayload, fallbackStage) {
    if (Array.isArray(outputPayload) && outputPayload[0] && Number.isFinite(Number(outputPayload[0].currentStageNumber))) {
        return Number(outputPayload[0].currentStageNumber);
    }
    if (Number.isFinite(Number(fallbackStage))) {
        return Number(fallbackStage);
    }
    return null;
}

function updateExplainabilityPanel(uiModel, formDataModel, stageNumber) {
    const listEl = document.getElementById('explainabilityListId');
    if (!listEl) return;

    const controls = (((uiModel || {}).containers || []).flatMap((container) => container.uiControls || []));
    const pathToData = uiModel?.pathToData || '(none)';
    const sampleName = sampleLabels[Number(itsQuestionnaireKey)] || 'Selected Sample';

    const lines = [];
    lines.push(`${sampleName} stage ${stageNumber} emitted ${controls.length} controls under path '${pathToData}'.`);
    lines.push(`Field values persist under accrued data at '${pathToData}.*' using each control's fieldName.`);

    const conditionalVisibilityControls = controls
        .filter((c) => c.triggeredByControlWithId && c.triggeredWhenSelection !== undefined)
        .slice(0, 3);
    conditionalVisibilityControls.forEach((c) => {
        lines.push(`${c.id}: visible when '${c.triggeredByControlWithId}' equals ${JSON.stringify(c.triggeredWhenSelection)}.`);
    });

    const conditionalRequiredControls = controls
        .filter((c) => c.requiredByControlWithId && c.requiredWhenSelection !== undefined)
        .slice(0, 3);
    conditionalRequiredControls.forEach((c) => {
        lines.push(`${c.id}: required when '${c.requiredByControlWithId}' equals ${JSON.stringify(c.requiredWhenSelection)}.`);
    });

    const currentDataObj = getByPath(formDataModel || {}, pathToData) || {};
    const populatedCount = controls.filter((c) => c.fieldName && isNonEmptyValue(currentDataObj[c.fieldName])).length;
    lines.push(`Populated values in this stage path: ${populatedCount}/${controls.filter((c) => !!c.fieldName).length}.`);

    listEl.innerHTML = '';
    lines.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        listEl.appendChild(li);
    });
}

function updateProvenanceSummary(uiModel, formDataModel) {
    const summaryEl = document.getElementById('provenanceSummaryId');
    if (!summaryEl) return;

    const controls = (((uiModel || {}).containers || []).flatMap((container) => container.uiControls || []));
    const pathToData = uiModel?.pathToData || '';
    const currentDataObj = getByPath(formDataModel || {}, pathToData) || {};

    const ruleDefined = controls.length;
    const derived = controls.filter((c) => typeof c.type === 'string' && c.type.toLowerCase().startsWith('readonly')).length;
    const userEntered = Math.max(ruleDefined - derived, 0);
    const systemDefault = controls.filter((c) => c.fieldName && isNonEmptyValue(currentDataObj[c.fieldName])).length;

    summaryEl.textContent = `${ruleDefined} rule-defined controls | ${userEntered} editable | ${derived} derived | ${systemDefault} prefilled/defaulted`;
}

function resetInsightPanels() {
    updateDurationMetric('perfDecisionMsId', 'perfDecisionDeltaId', NaN, null);
    updateDurationMetric('perfRenderMsId', 'perfRenderDeltaId', NaN, null);
    updateBytesMetric('perfInputBytesId', NaN);
    updateBytesMetric('perfOutputBytesId', NaN);
    const provenanceSummaryEl = document.getElementById('provenanceSummaryId');
    if (provenanceSummaryEl) provenanceSummaryEl.textContent = 'Waiting for stage render...';
    updateContractPanel('-');
}

function handleBeforeDecisionServiceExecution(event) {
    const payload = event?.theData?.input;
    const stage = event?.theData?.stage;
    updateBytesMetric('perfInputBytesId', computePayloadBytes(payload));
    updateContractPanel(stage);
}

function handleAfterDecisionServiceExecution(event) {
    const outputPayload = event?.theData?.output;
    const execTimeMs = Number(event?.theData?.execTimeMs);
    const stage = resolveCurrentStageFromOutput(outputPayload, event?.theData?.stage);
    const uiModel = Array.isArray(outputPayload) ? outputPayload[0] : null;
    const formDataModel = Array.isArray(outputPayload) ? outputPayload[1] : null;

    updateDurationMetric('perfDecisionMsId', 'perfDecisionDeltaId', execTimeMs, lastDecisionExecMs);
    if (Number.isFinite(execTimeMs)) {
        lastDecisionExecMs = execTimeMs;
    }
    updateBytesMetric('perfOutputBytesId', computePayloadBytes(outputPayload));

    if (stage !== null) {
        updateContractPanel(stage);
    }
    if (uiModel) {
        updateExplainabilityPanel(uiModel, formDataModel, stage ?? '-');
        updateProvenanceSummary(uiModel, formDataModel);
    }

    lastDsRenderedAtMs = performance.now();
}

function handleAfterUiStepRendered(event) {
    const renderMs = Number.isFinite(lastDsRenderedAtMs) ? performance.now() - lastDsRenderedAtMs : NaN;
    updateDurationMetric('perfRenderMsId', 'perfRenderDeltaId', renderMs, lastRenderMs);
    if (Number.isFinite(renderMs)) {
        lastRenderMs = renderMs;
    }

    const outputPayload = event?.theData?.output;
    const stage = resolveCurrentStageFromOutput(outputPayload, event?.theData?.stage);
    const uiModel = Array.isArray(outputPayload) ? outputPayload[0] : null;
    const formDataModel = Array.isArray(outputPayload) ? outputPayload[1] : null;

    if (stage !== null) {
        updateContractPanel(stage);
    }
    if (uiModel) {
        updateExplainabilityPanel(uiModel, formDataModel, stage ?? '-');
        updateProvenanceSummary(uiModel, formDataModel);
    }
}

/**
 * Attaches delegated event listeners and runs initial checks for conditional controls.
 * Includes conditional visibility and conditional required behavior.
 */
function setupConditionalVisibility() {
    const uiContainer = $('#dynUIContainerId');
    const useKui = itsFlagRenderWithKui;

    uiContainer.off('change.conditional');
    uiContainer.on('change.conditional', ':input', function () {
        const changedElement = $(this);
        let triggerId = changedElement.attr('id');
        let kendoWidget = null;
        const inputType = (changedElement.prop('type') || '').toLowerCase();

        if (inputType === 'radio') {
            const radioControlId = changedElement.attr('data-control-id') || changedElement.data('controlId');
            if (radioControlId) {
                triggerId = radioControlId;
            }
        }

        if (useKui) {
            kendoWidget = kendo.widgetInstance(changedElement);
            if (!kendoWidget && changedElement.parent().is('.k-widget')) {
                const originalElement = changedElement.parent().find('select, input').first();
                if (originalElement.length) {
                    kendoWidget = kendo.widgetInstance(originalElement);
                }
            }
            if (kendoWidget && !triggerId && changedElement.closest('.k-widget').length > 0) {
                triggerId = changedElement.closest('.k-widget').find('select, input').first().attr('id');
            }
        }

        if (triggerId) {
            const dependentElements = $(`#dynUIContainerId [data-triggered-by='${triggerId}']`);
            dependentElements.each(function () {
                updateConditionalVisibility($(this), kendoWidget);
            });

            const requiredDependentElements = $(`#dynUIContainerId [data-required-triggered-by='${triggerId}']`);
            requiredDependentElements.each(function () {
                updateConditionalRequired($(this), kendoWidget);
            });
        }
    });

    $('#dynUIContainerId [data-is-conditional="true"]').each(function () {
        const dependentContainer = $(this);
        const triggerId = dependentContainer.attr('data-triggered-by');
        let kendoWidget = null;
        if (triggerId) {
            let triggerElement = $(`#${triggerId}`);
            if (triggerElement.length === 0) {
                triggerElement = $(`#dynUIContainerId :radio[data-control-id='${triggerId}']`);
            }
            if (useKui && triggerElement.length) {
                kendoWidget = kendo.widgetInstance(triggerElement);
                if (!kendoWidget && triggerElement.parent().is('.k-widget')) {
                    kendoWidget = kendo.widgetInstance(triggerElement.parent().find('select, input').first());
                }
            }
        }
        updateConditionalVisibility(dependentContainer, kendoWidget);
    });

    $('#dynUIContainerId [data-required-conditional="true"]').each(function () {
        const dependentContainer = $(this);
        const triggerId = dependentContainer.attr('data-required-triggered-by');
        let kendoWidget = null;
        if (triggerId) {
            let triggerElement = $(`#${triggerId}`);
            if (triggerElement.length === 0) {
                triggerElement = $(`#dynUIContainerId :radio[data-control-id='${triggerId}']`);
            }
            if (useKui && triggerElement.length) {
                kendoWidget = kendo.widgetInstance(triggerElement);
                if (!kendoWidget && triggerElement.parent().is('.k-widget')) {
                    kendoWidget = kendo.widgetInstance(triggerElement.parent().find('select, input').first());
                }
            }
        }
        updateConditionalRequired(dependentContainer, kendoWidget);
    });
}

function resolveTriggerElementById(triggerId) {
    let triggerElement = $(`#${triggerId}`);
    let triggerIsRadioGroup = false;

    if (triggerElement.length === 0) {
        const radioGroupEls = $(`#dynUIContainerId :radio[data-control-id='${triggerId}']`);
        if (radioGroupEls.length > 0) {
            triggerElement = radioGroupEls;
            triggerIsRadioGroup = true;
        }
    }

    return { triggerElement, triggerIsRadioGroup };
}

function parseTriggerValues(triggerValuesStr) {
    let triggerValues;
    try {
        triggerValues = JSON.parse(triggerValuesStr);
        if (!Array.isArray(triggerValues)) {
            throw new Error('Not an array');
        }
        return triggerValues;
    } catch (e) {
        console.error('Could not parse trigger values:', triggerValuesStr, e);
        return null;
    }
}

function resolveCurrentTriggerValue(triggerElement, triggerIsRadioGroup, kendoWidget) {
    if (kendoWidget && typeof kendoWidget.value === 'function') {
        return kendoWidget.value();
    }

    const triggerType = (triggerElement.first().prop('type') || '').toLowerCase();
    if (triggerIsRadioGroup || triggerType === 'radio') {
        return triggerElement.filter(':checked').first().val();
    }
    if (triggerType === 'checkbox') {
        return triggerElement.is(':checked') ? 'true' : 'false';
    }
    return triggerElement.val();
}

function matchesTriggerValues(currentValue, triggerValues) {
    return currentValue !== undefined && currentValue !== null &&
        triggerValues.some((tv) => String(tv).toLowerCase() === String(currentValue).toLowerCase());
}

function updateConditionalVisibility(conditionalContainerEl, kendoWidget) {
    const triggerId = conditionalContainerEl.attr('data-triggered-by');
    const triggerValuesStr = conditionalContainerEl.attr('data-trigger-value');

    if (!triggerId || triggerValuesStr === undefined || triggerValuesStr === null) {
        return;
    }

    const triggerContext = resolveTriggerElementById(triggerId);
    const triggerElement = triggerContext.triggerElement;
    const triggerIsRadioGroup = triggerContext.triggerIsRadioGroup;

    if (triggerElement.length === 0) {
        conditionalContainerEl.hide().addClass('corticon-hidden-control');
        return;
    }

    const triggerValues = parseTriggerValues(triggerValuesStr);
    if (!triggerValues) {
        conditionalContainerEl.hide().addClass('corticon-hidden-control');
        return;
    }

    const currentValue = resolveCurrentTriggerValue(triggerElement, triggerIsRadioGroup, kendoWidget);
    const valueMatches = matchesTriggerValues(currentValue, triggerValues);

    if (valueMatches) {
        if (!conditionalContainerEl.is(':visible')) {
            conditionalContainerEl.slideDown(200).removeClass('corticon-hidden-control');
        }
    } else if (conditionalContainerEl.is(':visible')) {
        conditionalContainerEl.slideUp(200, function () {
            $(this).addClass('corticon-hidden-control');
        });
    }
}

function applyConditionalRequiredState(inputContainerEl, conditionMatched) {
    const isStaticRequired = String(inputContainerEl.attr('data-required-static')).toLowerCase() === 'true';
    const effectiveRequired = isStaticRequired || conditionMatched;
    const radioInputs = inputContainerEl.find(':radio[data-control-id]');

    if (radioInputs.length > 0) {
        if (effectiveRequired) {
            radioInputs.first().attr('data-required', true);
        } else if (!isStaticRequired) {
            radioInputs.removeAttr('data-required');
        }
    } else {
        const requiredTargetInputs = inputContainerEl.find(':input').not(':button,:submit,:reset,:hidden,:disabled');
        requiredTargetInputs.each(function () {
            const inputEl = $(this);
            if (effectiveRequired) {
                inputEl.attr('data-required', true);
            } else if (!isStaticRequired) {
                inputEl.removeAttr('data-required');
            }
        });
    }

    const requiredMarker = inputContainerEl.find('.required-marker').first();
    if (requiredMarker.length && inputContainerEl.attr('data-required-conditional') === 'true' && !isStaticRequired) {
        requiredMarker.toggleClass('conditional-required-inactive', !effectiveRequired);
    }
}

function updateConditionalRequired(inputContainerEl, kendoWidget) {
    const triggerId = inputContainerEl.attr('data-required-triggered-by');
    const triggerValuesStr = inputContainerEl.attr('data-required-trigger-value');

    if (!triggerId || triggerValuesStr === undefined || triggerValuesStr === null) {
        return;
    }

    const triggerContext = resolveTriggerElementById(triggerId);
    const triggerElement = triggerContext.triggerElement;
    const triggerIsRadioGroup = triggerContext.triggerIsRadioGroup;

    if (triggerElement.length === 0) {
        applyConditionalRequiredState(inputContainerEl, false);
        return;
    }

    const triggerValues = parseTriggerValues(triggerValuesStr);
    if (!triggerValues) {
        applyConditionalRequiredState(inputContainerEl, false);
        return;
    }

    const currentValue = resolveCurrentTriggerValue(triggerElement, triggerIsRadioGroup, kendoWidget);
    const valueMatches = matchesTriggerValues(currentValue, triggerValues);
    applyConditionalRequiredState(inputContainerEl, valueMatches);
}

function processClickStart() {
    const baseDynamicUIEl = $('#dynUIContainerId');
    itsStepsController.startDynUI(
        baseDynamicUIEl,
        currentDecisionServiceEngine,
        inputData,
        itsCurrentLanguage,
        itsQuestionnaireKey,
        itsFlagRenderWithKui
    );
}

function processClickNext() {
    const baseDynamicUIEl = $('#dynUIContainerId');
    itsStepsController.processNextStep(baseDynamicUIEl, currentDecisionServiceEngine, itsCurrentLanguage);
}

function processClickPrev() {
    const baseDynamicUIEl = $('#dynUIContainerId');
    itsStepsController.processPrevStep(baseDynamicUIEl, currentDecisionServiceEngine, itsCurrentLanguage);
}

function processShowTrace() {
    $('.allTracesContainer').show();
    $('#hideTraceId').show();
    $('#showTraceId').hide();
    saveStateToLocalStorage('CorticonShowDSTrace', 'true');
    applyDisplayOptions(readDisplayOptions());
}

function processHideTrace() {
    $('.allTracesContainer').hide();
    $('#showTraceId').show();
    $('#hideTraceId').hide();
    saveStateToLocalStorage('CorticonShowDSTrace', 'false');
    const performanceWidget = document.getElementById('performanceWidgetZone');
    if (performanceWidget) {
        performanceWidget.style.display = 'none';
    }
}

function processUseHtml() {
    $('#useHtmlId').hide();
    $('#useKuiId').show();
    saveStateToLocalStorage('CorticonUseKui', 'false');
    itsFlagRenderWithKui = false;
}

function processUseKui() {
    $('#useHtmlId').show();
    $('#useKuiId').hide();
    saveStateToLocalStorage('CorticonUseKui', 'true');
    itsFlagRenderWithKui = true;
}

function setupInitialInputData() {
    const inDataEmpty = {};
    allInputData = [
        inDataEmpty, // Homeowners
        inDataEmpty, // Job Application
        inDataEmpty, // I18N + SCO
        inDataEmpty, // Country/State/City
        inDataEmpty, // Vehicle Make/Model/Year
        inDataEmpty, // Property/Casualty
        inDataEmpty, // hhsMarketplace
        inDataEmpty, // Foreign Risk
        inDataEmpty  // Crossing Form
    ];
    inputData = allInputData[0];
}

function restoreUIState() {
    const show = window.localStorage.getItem('CorticonShowDSTrace');
    if (show === 'true') {
        processShowTrace();
    } else if (show === 'false') {
        processHideTrace();
    }

    const useKui = window.localStorage.getItem('CorticonUseKui');
    if (useKui === 'true') {
        processUseKui();
    } else if (useKui === 'false') {
        processUseHtml();
    }

    const selectedSample = window.localStorage.getItem('CorticonSelectedSample');
    if (selectedSample !== null && allInputData[selectedSample]) {
        const selector = `#sampleSelectId option[value='${selectedSample}']`;
        $(selector).prop('selected', true);
        setDataForCurrentSample(selectedSample);
    } else {
        setDataForCurrentSample('0');
    }
}

$(document).ready(function () {
    if (!window.corticonEngines || window.corticonEngines.length === 0) {
        console.error('Corticon Decision Service engine not found. Cannot initialize.');
        $('#dynUIContainerId').html('<div style="color: red; padding: 20px;">Error: Decision Service Engine not loaded.</div>');
        return;
    }

    currentDecisionServiceEngine = window.corticonEngines[0];
    setupInitialInputData();
    itsTracer.setupTracing();
    restoreUIState();
    initializeDisplayOptionsControls();
    closeHelpBubblesOnOutsideClick();
    resetInsightPanels();

    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.AFTER_UI_STEP_RENDERED, () => {
        setupConditionalVisibility();
    });

    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.BEFORE_DS_EXECUTION, handleBeforeDecisionServiceExecution);
    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.NEW_DS_EXECUTION, handleAfterDecisionServiceExecution);
    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.AFTER_UI_STEP_RENDERED, handleAfterUiStepRendered);

    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.BEFORE_START, () => {
        $('#dynUIContainerId').off('change.conditional');
        lastDecisionExecMs = null;
        lastRenderMs = null;
        lastDsRenderedAtMs = null;
        resetInsightPanels();
    });

    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.AFTER_START, (event) => {
        $('#nextActionId').show();
        $('#startActionId').hide();
        $('#sampleSelectId').prop('disabled', true);
        $('#useHtmlId').hide();
        $('#useKuiId').hide();
        if (event?.theData?.historyEmpty) {
            $('#prevActionId').hide();
        } else {
            $('#prevActionId').show();
        }
    });

    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.NEW_STEP, () => {
        $('#prevActionId').show();
    });

    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.HISTORY_STATUS_CHANGED, (event) => {
        if (event?.theData?.historyEmpty) {
            $('#prevActionId').hide();
        } else {
            $('#prevActionId').show();
        }
    });

    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.BACK_AT_FORM_BEGINNING, () => {
        $('#prevActionId').hide();
    });

    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.AFTER_DONE, () => {
        $('#nextActionId').hide();
        $('#prevActionId').hide();
        $('#startActionId').show();
        $('#sampleSelectId').prop('disabled', false);
        $('#dynUIContainerId').html('<div style="margin: 2em; font-size: larger;">&nbsp;<i class="bi bi-check-circle"></i>All Done</div>');
        if (itsFlagRenderWithKui) {
            $('#useHtmlId').show();
        } else {
            $('#useKuiId').show();
        }
        updateContractPanel(999);
    });

    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.REVIEW_STEP_DISPLAYED, (event) => {
        $('#nextActionId').show();
        if (event?.theData?.historyEmpty) {
            $('#prevActionId').hide();
        } else {
            $('#prevActionId').show();
        }
    });

    corticon.dynForm.addCustomEventHandler(corticon.dynForm.customEvents.DISABLE_NAVIGATION, () => {
        $('#nextActionId').hide();
        $('#prevActionId').hide();
    });
});
