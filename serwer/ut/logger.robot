*** Settings ***
Library    libraries/LoggerMock.py
Library  OperatingSystem
Library  Collections

Suite Setup   define variables
Test Setup  set output filepath to  ${exampleLog}
Test Teardown  clear

*** Keywords ***
define variables
    ${exampleLog}  Join Path  ${CURDIR}  test.log
    set suite variable  ${exampleLog}  ${exampleLog}

call method and check result for
    [Arguments]  ${keyword}  ${type}
    run keyword  ${keyword}  Example A
    ${allLines}  get Lines From Log  ${exampleLog}
    ${errors}  get lines from list ${allLines} with ${type}
    ${numberOfErrors}  get length  ${errors}
    ${numberOfLines}  get length  ${allLines}
    should be equal as integers  ${numberOfErrors}  1
    should be equal as integers  ${numberOfLines}  1

*** Test Cases ***
Log file creates on setting filepath
    [Tags]    logger
    file should exist  ${exampleLog}

Log file is empty on start
    [Tags]    logger
    file should be empty  ${exampleLog}

Setting dictionary as file path should fail
    [Tags]    logger
    [Setup]  no operation
    ${expectedErrorMessage}  set variable  Path to file was expected, found: ${CURDIR}
    run keyword and expect error  ${expectedErrorMessage}  set output filepath to  ${CURDIR}

Log file shouldn't be empty after logging
    [Tags]    logger
    debug  "debug"
    file should not be empty  ${exampleLog}

After logging only one error should containt only one error
    [Template]    call method and check result for
    error  ERROR

After logging only one debug should containt only one debug
    [Template]    call method and check result for
    debug  DEBUG

After logging only one info should containt only one info
    [Template]    call method and check result for
    info  INFO

After logging only one warning should containt only one warning
    [Template]    call method and check result for
    warning  WARNING