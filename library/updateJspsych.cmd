@echo git submodule update --init --force --remote
@git submodule update --init --force --remote
@echo.
@echo Finish fetching jsPsych...
@echo.
@cmd /c "bundleJspsych.cmd && exit"