import React from 'react'
import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './calc.css';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

//Helper Classes
const _mapperService = require('./calcMapper');

//API CONFIG
const apigClientFactory = require('aws-api-gateway-client').default;
const apiUrl = "https://vhjtg39hhc.execute-api.us-east-1.amazonaws.com/Development";
const apigClient = apigClientFactory.newClient({
  invokeUrl: apiUrl, // REQUIRED
  accessKey: "AKIAZS7HYQJRIXJ4XZGC", // REQUIRED
  secretKey: "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", // REQUIRED
  region: 'us-east-1' // REQUIRED: The region where the API is deployed.
})

class NSMCalc extends React.Component {
  

  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      yesNoAnswer: false,
      values: [],
      currentValue: undefined,
      calcState: 0,
      predictedRiskPercentage: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);


  }

  componentDidMount() {
    this.setupValuesArray();
    this.setupMapperObject();
  }

  render() {
    const steps = this.getSteps();
    const { activeStep, yesNoAnswer } = this.state;

    return(
      <div className="page-wrapper">
        {this.state.calcState == 1 &&
          <div className="calc-overlay calculating-overlay">
            <div className="contents">
              <div className="logo">
                <p>NSM CALC</p>
                <img src="/images/health-icon.png" alt="Health Logo" />
              </div>
              <div className="sep"></div>
              <div className="message-wrapper">
                <p className="message">Calculating Risk...</p>
              </div>
            </div>
          </div>
        }
        {this.state.calcState == 2 &&
          <div className="calc-overlay results-overlay">
            <div className="contents">
              <div className="logo done">
                <p>NSM CALC</p>
                <img src="/images/health-icon.png" alt="Health Logo" />
              </div>
              <div className="sep"></div>
              <div className="message-wrapper">
              <p className="message percent">{this.state.predictedRiskPercentage}</p>
                <Button variant="contained" color="primary" onClick={this.resetForm} className="button-primary start-over-btn">
                    Start Over
                </Button>
              </div>
            </div>
          </div>
        }

        <div className="stepper-wrapper">
          <Stepper activeStep={activeStep} orientation="vertical" className="stepper">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel color='#8e44ad'>{label}</StepLabel>
                <StepContent>
                  <Typography>{this.getStepContent(index)}</Typography>

                  {/* At step 1, show a normal input */}
                  {activeStep === 1 && 
                      <div className="step-input-wrapper">
                        <Input value={this.state.values[activeStep].value} onChange={this.handleInputChange} name="Age" placeholder="" type="number" className="step-input" inputProps={{'aria-label': 'Description',}}/>
                      </div>
                  }

                  {/* At step 4, show the height and weight fields */}
                  {activeStep === 4 && 
                        <div className="height-weight-wrapper">
                          <TextField
                            label="feet"
                            className="text-field feet-field"
                            type="number"
                            margin="normal"
                            name="feet"
                            value={this.state.values[activeStep].feet} onChange={this.handleInputChange}
                          />
                          <TextField
                            label="inches"
                            className="text-field inches-field"
                            type="number"
                            margin="normal"
                            name="inches"
                            value={this.state.values[activeStep].inches} onChange={this.handleInputChange}
                          />
                          <TextField
                            label="pounds"
                            className="text-field pounds-field"
                            type="number"
                            margin="normal"
                            name="pounds"
                            value={this.state.values[activeStep].pounds} onChange={this.handleInputChange}
                          />
                        </div>
                  }

                  {/* At step 5, show the therapeutic and prophylactic radion fields */}
                  {activeStep === 5 &&
                    <div className="treatment-reason">
                      <div className="radio-wrapper">
                        <RadioGroup
                          aria-label="RadioGroup"
                          name="treatmentreasongroup"
                          className="radio-group"
                          value={this.state.values[activeStep].value} onChange={this.handleInputChange}
                        >
                          <FormControlLabel className="radio-btn no-radio" value="Therapeautic Mastectomy" control={<Radio />} label="Therapeutic" />
                          <FormControlLabel className="radio-btn yes-radio" value="Prophylactic" control={<Radio />} label="Prophylactic" />
                        </RadioGroup>
                      </div>
                    </div>
                  }

                  {/* At step 10, show the breast size pictures */}
                  {activeStep === 10 &&
                    <div className="breast-size">
                      <div className="radio-wrapper">
                        <RadioGroup
                          aria-label="RadioGroup"
                          name="breastsizegroup"
                          className="radio-group"
                          value={this.state.values[activeStep].value} onChange={this.handleInputChange}
                        >
                          <div className="radio-image-wrapper">
                            <div className="radio-image" style={{ backgroundImage: "url(/images/breast-c.png)" }}></div>
                            <FormControlLabel className="radio-btn yes-radio" value="400" control={<Radio />} label="400-799 grams (~C cup)" />
                          </div>
                          <div className="radio-image-wrapper">
                            <div className="radio-image" style={{ backgroundImage: "url(/images/breast-d.png)" }}></div>
                            <FormControlLabel className="radio-btn yes-radio" value="800" control={<Radio />} label="≥ 800 grams (~D cup or greater)" />
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  }
                  {/* At step 11, show the breast incision picture */}
                  {activeStep === 11 &&
                    <div className="incision">
                      <div className="incision-image" style={{ backgroundImage: "url(/images/breast-incisions.png)" }}></div>
                      <div className="radio-wrapper">
                        <RadioGroup
                          aria-label="RadioGroup"
                          name="incisiongroup"
                          className="radio-group"
                          value={this.state.values[activeStep].value} onChange={this.handleInputChange}
                        >
                          <FormControlLabel className="radio-btn no-radio" value="Lateral Radial Mastectomy Incision" control={<Radio />} label="Lateral Radial Incision" />
                          <FormControlLabel className="radio-btn yes-radio" value="Wise-Pattern Mastectomy Incision" control={<Radio />} label="Wise-Pattern Incision" />
                          <FormControlLabel className="radio-btn yes-radio" value="Periareolar Mastectomy Incision" control={<Radio />} label="Periareolar Incision" />
                          <FormControlLabel className="radio-btn yes-radio" value="Vertical Mastectomy Incision" control={<Radio />} label="Vertical Incision" />
                          <FormControlLabel className="radio-btn yes-radio" value="Other Mastectomy Incision" control={<Radio />} label="Other Incision" />
                        </RadioGroup>
                      </div>
                    </div>
                  }

                  
                  {/* At step 12, show the therapeutic and prophylactic radion fields */}
                  {activeStep === 12 &&
                    <div className="treatment-reason">
                      <div className="radio-wrapper">
                        <RadioGroup
                          aria-label="RadioGroup"
                          name="reconstructiontypegroup"
                          className="radio-group"
                          value={this.state.values[activeStep].value} onChange={this.handleInputChange}
                        >
                          <FormControlLabel className="radio-btn yes-radio" value="Immediate Implant Reconstruction" control={<Radio />} label="Immediate Implant" />
                          <FormControlLabel className="radio-btn yes-radio" value="Autologous Reconstruction" control={<Radio />} label="Autologous" />
                          <FormControlLabel className="radio-btn yes-radio" value="Tissue Expander" control={<Radio />} label="Tissue Expander" />
                        </RadioGroup>
                      </div>
                    </div>
                  }

                  {/* If the step is a yes/no question, show the radio buttons */}
                  {yesNoAnswer === true && 
                  <div className="radio-wrapper">
                        <RadioGroup
                          aria-label="Radio Group"
                          name="yesnogroup"
                          className="radio-group"
                          value={this.state.values[activeStep].value} onChange={this.handleInputChange}
                        >
                          <FormControlLabel className="radio-btn no-radio" value="0" control={<Radio />} label="No" />
                          <FormControlLabel className="radio-btn yes-radio" value="1" control={<Radio />} label="Yes" />
                        </RadioGroup>
                  </div>
                  }

                  {/* Buttons */}
                  <div className="action-container">
                    <div>

                      {/* At step 0, show the begin button only */}
                      {activeStep === 0 &&
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.handleNext}
                          className="button-begin"
                        >
                          Begin 
                        </Button>
                      }

                      {/* All steps greater than 0, show the back and next buttons */}
                      {activeStep > 0 &&
                        <div className="back-next-btns">
                          <Button
                            variant="contained"
                            disabled={activeStep === 0}
                            color="primary"
                            onClick={this.handleBack}
                            className="button-secondary back-btn"
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleNext}
                            className="button-primary next-btn"
                          >
                            Next
                          </Button>
                        </div>
                      }
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {/* Message shown when form is finished */}
          {activeStep === steps.length && (
            <Paper square elevation={0} className="reset-container">
              <Typography>All steps completed - Would you like to submit and get your risk percentage?</Typography>
              <Button variant="contained" color="primary" onClick={this.handleFinish} className="button-primary next-btn submit-btn">
                Submit
              </Button>
            </Paper>
          )}
        </div>
      </div>
    );
  }

  getSteps() {
    var steps = [
      'Nipple Sparing Mastectomy - Predicted Risk Percentage',
      'What is your age?',
      'Do you currently smoke tobacco?',
      'Do you have diabetes mellitus?',
      'What is your current height and weight?',
      'Are you having a mastectomy for breast cancer (therapeutic) or to prevent future breast cancer (prophylactic)?',
      'Have you ever had chemotherapy in the past?',
      'Have you ever had radiation therapy to this breast or your chest area in the past?',
      'Do you expect to need radiation therapy for your breast after your mastectomy?',
      'Do you expect to need chemotherapy after your mastectomy?',
      'How large is your breast?',
      'What incision is your surgeon planning to use for your mastectomy?',
      'What type of breast reconstruction are you having?'
    ];

    return steps;
  }

  getStepContent(step) {
    switch (step) {
      case 0:
        return `
        The following questions will help to predict the odds of having a complication during breast reconstruction after nipple-sparing mastectomy. 
        This tool can help give you and/or your surgeons more information for the decision-making process regarding breast reconstruction. 
        It is important to recognize that this is a predictive tool and cannot perfectly guarantee a positive or negative outcome after breast reconstruction and nipple-sparing mastectomy.
        Please note, if you are undergoing nipple-sparing mastectomy on only one breast (unilateral), please answer all questions for the breast undergoing the procedure. 
        If you are undergoing nipple-sparing mastectomy on both breasts (bilateral), please answer all questions for one breast first and repeat the process for the second breast after as each predicted percentage will pertain to each respective breast.`;

      default:
        return '';
    }
  }

  setupMapperObject = () => {
    this.submissionObject = this.submissionObject = [
      {
        "assessmentInput": {
          "variableName": "Age",
          "variableValue": 0,
          "variableUuid": "606782b2-1580-4f4c-8ea9-5f1474ca30bd"
        }
      },			
      {
        "assessmentInput": {
          "variableName": "Active Smoking",
          "variableValue": 0,
          "variableUuid": "ef0d6123-54e4-4f71-9249-502043ccca5a"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Diabetes Mellitus",
          "variableValue": 0,
          "variableUuid": "0292f0f3-caf8-4e13-9bff-1d3cbbdc6890"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Body Mass Index",
          "variableValue": 0,
          "feet": 0,
          "inches": 0,
          "weight": 0,
          "variableUuid": "10ae985a-a295-4255-abd2-1675eb25d93f"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Therapeautic Mastectomy",
          "variableValue": 0,
          "variableUuid": "d0dcb659-3584-445d-9a57-65f0bd9761ee"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Prior Chemotherapy",
          "variableValue": 0,
          "variableUuid": "ef591f7d-d27b-476a-9751-29bcefc03952"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Prior Radiation",
          "variableValue": 0,
          "variableUuid": "cad1754f-f70c-45ed-a0ab-8c2866a7b299"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Adjuvant Radiation",
          "variableValue": 0,
          "variableUuid": "419d1045-6eb3-45fb-a040-c52c8e9f7edf"
        }
      },			
      {
        "assessmentInput": {
          "variableName": "Adjuvant Chemotherapy",
          "variableValue": 0,
          "variableUuid": "6e126426-4a37-4ec5-b0d6-fa41d1422d3b"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Mastectomy Weight(400-799 grams)",
          "variableValue": 0,
          "variableUuid": "3e079d3b-ac08-4d97-a124-6e64b73cf8ad"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Mastectomy Weight(>= 800 grams)",
          "variableValue": 0,
          "variableUuid": "a01d966b-77b8-4eda-8824-7ea0712da23b"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Vertical Mastectomy Incision",
          "variableValue": 0,
          "variableUuid": "da63d78b-7640-4faf-ab3a-24da04c84de1"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Lateral Radial Mastectomy Incision",
          "variableValue": 0,
          "variableUuid": "6327cbac-dba0-409a-8f25-7b30a8908234"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Wise-Pattern Mastectomy Incision",
          "variableValue": 0,
          "variableUuid": "636d4ee0-6fae-4772-84e7-f79db5523726"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Periareolar Mastectomy Incision",
          "variableValue": 0,
          "variableUuid": "ffb8fb6d-507f-42c0-ad56-2b0ed9901b16"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Other Mastectomy Incision",
          "variableValue": 0,
          "variableUuid": "b831a833-e744-4b80-9218-cdd2d9b0384c"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Immediate Implant Reconstruction",
          "variableValue": 0,
          "variableUuid": "96639c3a-e21a-4322-a00a-06d70f14570b"
        }
      },
      {
        "assessmentInput": {
          "variableName": "Autologous Reconstruction",
          "variableValue": 0,
          "variableUuid": "dab87d61-6fed-44ff-bea4-376c88eab7e7"
        }
      }
    ];
  }

  setupValuesArray = () => {
    var valuesArr = [
      //0 ignore this is the begin value
      {
        name: "ignore",
        value: ""
      },
      //Age value
      {
        name: "Age",
        value: ""
      },
      //Active Smoking
      {
        name: "Active smoking",
        value: ""
      },
      //diabetees malitus
      {
        name: "Diabetes Mellitus",
        value: ""
      },
      //BMI input
      {
        name: "Body Mass Index",
        feet: "",
        inches: "",
        pounds: "",
        value: ""
      },
      //Therapuetic or Prophylactic - if Proph, the value is 0 for this field
      {
        name: "Therapeautic Mastectomy",
        value: ""
      },
      //PRIOR CHEMO
      {
        name: "Prior Chemotherapy",
        value: ""
      },
      //PRIOR RADIATION
      {
        name: "Prior Radiation",
        value: ""
      },
      //ADJUVENT RADIATION
      {
        name: "Adjuvant Radiation",
        value: ""
      },
      //ADJUVANT CHEMO
      {
        name: "Adjuvant Chemotherapy",
        value: ""
      },
      //BREAST SIZE
      {
        name: "Mastectomy Weight",
        value: ""
      },
      //INCISIONS
      {
        name: "Incision Type",
        value: ""
      },
      //RECONSTRUCTION TYPE
      {
        name: "Reconstruction Type",
        value: ""
      }
    ];

    this.setState(state => ({
      values: valuesArr,
      currentValue: valuesArr[0]
    }));
  };

  handleNext = () => {
    this.handleStep(this.state.activeStep + 1);
  };

  handleBack = () => {
    this.handleStep(this.state.activeStep - 1);
  };

  handleFinish = async () => {   
    // Send request to calculate percentage.
    this.setState({ calcState: 1 });
    //map our state array to what our backend expects
    this.mappedBody =  _mapperService.mapObjects(this.submissionObject, this.state.values);

    //calculate
    let response =  await apigClient.invokeApi('', '/assessments/nsm', 'POST', '', this.mappedBody);

    //set our prop
    this.state.predictedRiskPercentage = response.data.PredictedRiskPercentage;
    this.setState({ calcState: 2 });

    //debug
    console.log(this.state);

   };

  resetForm = () => {
    this.setState({
      activeStep: 0,
      yesNoAnswer: false,
      values: [],
      currentValue: undefined,
      calcState: 0
    });

    this.setupValuesArray();
  };

  handleStep = (newStep) => {
    this.setState(state => ({
      activeStep: newStep,
      currentValue: state.values[newStep]
    }), () => {

      switch (newStep) {
        case 0:
          this.setState(state => ({
            yesNoAnswer: false
          }));
          break;

        case 1:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 2:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 3:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 4:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 5:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 6:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 7:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 8:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 9:
          this.setState(state => ({
            yesNoAnswer: true,
          }));
          break;

        case 10:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 11:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 12:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        case 13:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;

        default:
          this.setState(state => ({
            yesNoAnswer: false,
          }));
          break;
      }
    });
  };

  handleInputChange(event) {
    var values = this.state.values;
    var activeStep = this.state.activeStep;
    var inputName = event.target.getAttribute("name");

    //instead of case switch to a loop 
    //need to iterate through the state values array until name matches the input name
    //once we match set the value
    //everything else remains 0 
    //still need to do the active step check for feet inches and pounds 
    //do not do the call on each submission of feet inches pounds do it on the next button click 

    //UPDATED do an if check on the current step,
    //if it's a yes no answer do values[activeStep].variableValue = event.target.value;
    //IF IT ISNT, we need to do our looping logic from above

    switch (activeStep) {
      case 4:
        if (inputName == "feet") {
          values[activeStep].feet = event.target.value;
        }
        else if (inputName == "inches") {
          values[activeStep].inches = event.target.value;
        }
        else if (inputName == "pounds") {
          values[activeStep].pounds = event.target.value;
        }
        break;
        
      default:
        values[activeStep].value = event.target.value;
        break;
    }

    this.setState({
      values: values
    });
  }
}

const mapStateToProps = ({ counter }) => ({
  count: counter.count
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePage: () => push('/about-us')
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NSMCalc)