@cmd /c "cd library && updateJspsych.cmd && exit"
@aws s3 sync .\public s3://builder.jspsych.org
@echo.
@echo done...