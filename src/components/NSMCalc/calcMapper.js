const math = require('mathjs');
const _parser = math.parser();

exports.mapObjects = function mapObjects(submissionObject, stateArray){
    //loop through our inputs to map to our submission object
    for (var input of stateArray){
        switch(input.name){
            case "Age":
                submissionObject[0].assessmentInput.variableValue = input.value;
                break;
            case "Active Smoking": 
                submissionObject[1].assessmentInput.variableValue = input.value;
                break;
            case "Diabetes Mellitus":
                submissionObject[2].assessmentInput.variableValue = input.value;
                break;
            case "Body Mass Index":
                var heightInInches = _parser.evaluate(input.feet + '* 12 + ' + input.inches);
                var heightSquared = _parser.evaluate(heightInInches + '^2');
                var bmi = _parser.evaluate('(' + input.pounds + '/' + heightSquared + ')' + ' * 703');
                var bmi = math.round(bmi, 2);
                //stamp the object
                submissionObject[3].assessmentInput.variableValue = bmi;
            case "Therapeautic Mastectomy":
                if(input.value == "Therapeautic Mastectomy") {
                    submissionObject[4].assessmentInput.variableValue = '1';
                }
            case "Prior Chemotherapy":
                submissionObject[5].assessmentInput.variableValue = input.value;
            case "Prior Radiation":
                submissionObject[6].assessmentInput.variableValue = input.value;
            case "Adjuvant Radiation":
                submissionObject[7].assessmentInput.variableValue = input.value;
            case "Adjuvant Chemotherapy":
                submissionObject[8].assessmentInput.variableValue = input.value;
            case "Mastectomy Weight":
                if(input.value == "400"){
                    submissionObject[9].assessmentInput.variableValue = "1";
                } else {
                    submissionObject[10].assessmentInput.variableValue = "1";
                }
            case "Incision Type":
                switch(input.value){
                    case "Vertical Mastectomy Incision":
                        submissionObject[11].assessmentInput.variableValue = "1";
                        break;
                    case "Lateral Radial Mastectomy Incision":
                        submissionObject[12].assessmentInput.variableValue = "1";
                        break;
                    case "Wise-Pattern Mastectomy Incision":
                        submissionObject[13].assessmentInput.variableValue = "1";
                        break;
                    case "Periareolar Mastectomy Incision":
                        submissionObject[14].assessmentInput.variableValue = "1";
                        break;                    
                    case "Other Mastectomy Incision":
                        submissionObject[15].assessmentInput.variableValue = "1";
                        break;
                }
                break;
            case "Reconstruction Type":
                    switch(input.value){
                        case "Immediate Implant Reconstruction":
                            submissionObject[16].assessmentInput.variableValue = "1";
                            break;
                        case "Autologous Reconstruction":
                            submissionObject[17].assessmentInput.variableValue = "1";
                            break;
                    }
                    break;
        }
    }
    console.log(submissionObject)
    return submissionObject

}
