// sidebars.js

module.exports = {
  docs: [
    {
      type: 'doc',
      id: 'intro', // Link to the intro.md file
      label: 'Welcome',
    },
    {
      type: 'category',
      label: '⭐ Core Concepts',
      collapsed: false,
      items: [
        'fundamentals/logic-vs-presentation',
        'fundamentals/decision-explainability', // Assuming this explains architecture/data-flow
      ],
    },
    {
      type: 'category',
      label: '🚀 Developer Guide',
      collapsed: true,
      items: [
        'front-end-integration/integration',
        'front-end-integration/rendering_files',
        'front-end-integration/form-presentation',
      ],
    },
    {
      type: 'category',
      label: '📜 Rule Authoring',
      collapsed: true,
      items: [
        'rule-logic/ui-vocabulary',
        'rule-logic/form-presentation',
      ],
    },
    // Future section for live examples
    // {
    //   type: 'category',
    //   label: 'Live Examples',
    //   items: [],
    // },
  ],
};