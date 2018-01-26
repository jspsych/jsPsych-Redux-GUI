@echo git submodule update
@git submodule update
@echo.
@echo Finish updating jsPsych...
@echo.
@cd library
@cmd /c "bundleJspsych.cmd && exit"
@echo done...
