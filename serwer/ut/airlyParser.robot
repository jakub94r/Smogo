*** Settings ***
Library  ../core/Parsers/ParserFactory.py
Library  libraries/AirlyParserMock.py
Library  OperatingSystem
Library  Collections

Suite Setup  define variables

*** Keywords ***
define variables
    ${exampleResponsePath}  Join Path  ${CURDIR}  data  airlyExampleMeasure.json
    set suite variable  ${exampleResponsePath}  ${exampleResponsePath}
    ${exampleResponsePath2}  Join Path  ${CURDIR}  data  airlyExampleMeasure2.json
    set suite variable  ${exampleResponsePath2}  ${exampleResponsePath2}

*** Test Cases ***
AirlyParser is created by factory without error
    [Tags]    airly  parser
    ${parser}  factory  AirlyParser
    ${parserIsAirlyParserObject}  is AirlyParser  ${parser}
    should be true  ${parserIsAirlyParserObject}  Parser from factory is not a AirlyParser object

AirlyParser contains reads correct data after new response
    [Tags]    airly  parser
    ${crawler}  get Crawler
    add response from file  ${exampleResponsePath}
    send request  ${crawler}
    add response from file  ${exampleResponsePath2}
    send request  ${crawler}
    ${dataFromResponse}  get data
    ${keys}  create list  PM1  PM25  PM10  PRESSURE  HUMIDITY  TEMPERATURE
    ${values}  create list  12.0  18.0  35.0  1012.0  66.0  24.0
    run keyword and continue on failure  should be equal  ${dataFromResponse.parserType}  AirlyParser
    run keyword and continue on failure  should be equal  ${dataFromResponse.measureTime}  2018-08-24T08:24:48.652Z
    :FOR  ${i}  ${key}  in enumerate  @{keys}
    \  ${value}  get from list  ${values}  ${i}
    \  run keyword and continue on failure  should contain  ${dataFromResponse.values}  ${key}
    \  ${valueFromResponse}  Get From Dictionary  ${dataFromResponse.values}  ${key}
    \  run keyword and continue on failure  should be equal as numbers  ${valueFromResponse}  ${value}
