module.exports = {
    "extends": "google",
    "plugins": [ "react" ],
    "settings": {
        "react": {
            "createClass": "createClass",
            "pragma": "React",
            "version": "15.0"
        }
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "sourceType": "module",
            "allowImportExportEverywhere": false,
            "codeFrame": false
        }
    },
    "rules": {
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "no-console": 0,
        "no-undef": 0,
        "no-redeclare": 0,
        "strict": 0
    },
    "env": {
        "es6": true,
        "jest": true,
        "shared-node-browser": true,
    },
    "parserOptions": {
        "sourceType": "module"
    },
    "extends" : ["eslint:recommended", "plugin:react/recommended"],
};
