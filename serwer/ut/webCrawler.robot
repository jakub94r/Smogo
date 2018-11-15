*** Settings ***
Library    libraries/WebCrawlerMock.py
Library  OperatingSystem

Suite Setup   define variables
Test Setup  start
Test Teardown  run keyword and continue on failure  stop

*** Keywords ***
define variables
    ${exampleConfig}  Join Path  ${CURDIR}  data  servers.json
    ${exampleWrongConfig}  Join Path  ${CURDIR}  data
    set suite variable  ${exampleConfig}  ${exampleConfig}
    set suite variable  ${exampleWrongConfig}  ${exampleWrongConfig}

at least 100 iterations
    ${aliveCounter}  getAliveCounter
    should be true  ${aliveCounter} > 100

*** Test Cases ***
webcrawler should start and stop
    [Tags]    webcrawler
    [Timeout]    10 sec
    no operation

webcrawler should load config and stop without error
    [Tags]    webcrawler
    [Timeout]    10 sec
    load configs  ${exampleConfig}
    wait until keyword succeeds  5s  1s  at least 100 iterations

webcrawler should fail on loading dir as config
    [Tags]    webcrawler
    [Timeout]    10 sec
    ${aliveCounter}  get Alive Counter
    should be equal as integers  ${aliveCounter}  0
    run keyword and expect error  Couldn't load config from path: ${exampleWrongConfig}  load configs  ${exampleWrongConfig}
    ${aliveCounter}  get Alive Counter
    should be equal as integers  ${aliveCounter}  0
