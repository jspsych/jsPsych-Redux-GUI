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
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "no-console": 0,
    },
    "env": {
        "es6": true
    },
    "parserOptions": {
        "sourceType": "module"
    },
    "extends" : ["eslint:recommended", "plugin:react/recommended"],
};
