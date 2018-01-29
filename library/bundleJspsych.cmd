@del ..\public\jsPsych\jspsych.min.js
@del ..\public\jsPsych\jspsych.css
@java -jar closure-compiler.jar --js ./jspsych/jspsych.js ./jspsych/plugins/*.js --js_output_file ../public/jsPsych/jspsych.min.js
@echo Built "../public/jsPsych/jspsych.min.js"
copy /y .\jspsych\css\jspsych.css ..\public\jsPsych\
@echo.
@echo Finish bundling jsPsych...