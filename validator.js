//Object Validator
function Validator(options) {               //options here is an object

    //When the forEach goes through the rules, each inputElement is assigned with a rule
    //How do we assign multiples for 1 input element? Since there will be override if we do so
    //Solution: with the forEach, save all the rules into an object so the fields won't be overriden

    function getParent(element, selector){ //using parameters element and selector because
                                            //looking at the var errorElement with parentElement
                                            //we see inputElement and errorSelector as materials

        while (element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {

    }

    function validate(inputElement, rule){                      //check if the input in the box is valid
       
        // how to get the form-message (under the type box)
        // var errorElement = inputElement.parentElement.querySelector(options.errorSelector)  //inputElement.parentElement gets the div tag that contains the inputElement tag
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
        var errorMessage

        var rules = selectorRules[rule.selector]    //the selector is form the principles below, when they return


        for(i=0; i<rules.length; ++i){
            switch(inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value) //rules here is a function so the inputElement.value is parameter
            }
            
            
            }
        
        

            if(errorMessage){
                errorElement.innerText = errorMessage
                getParent(inputElement, options.formGroupSelector).classList.add('invalid') 
                
            } else {
                errorElement.innerText = ''
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                
    }

        return !errorMessage
}
        

    var formElement = document.querySelector(options.form);     //getting element of the form that needs validating
    
    if(formElement){

        //When submit the form
        formElement.onsubmit = function(e) {
            e.preventDefault()

            //Check if there's no error then proceed to receive data from all fields
            var isFormValid = true; //set this to true, later in the forEach if anything wrong set to false

            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                

                var isValid = validate(inputElement, rule);
                if (!isValid){
                    isFormValid = false
                }
                });

                                                                                      
                                                                                            
                
            if(isFormValid){

                //This is submitting with Js
                if (typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')  //get all the fields that can be typed in 
                                                                                                //in this block of form.
                                                                                                //[name]:not([disabled]) means getting all
                                                                                                //tags that have name attribute but not
                                                                                                //disbaled attribute

                    //Here we wanna get all the values that are put in the fields and assign all to var formValues                                                                       
                    var formValues = Array.from(enableInputs).reduce(function(values, input){       //This means converting enableInputs into array type since it's node type
                                                                  //so we can use reduce method to get out every of each value in enableInputs 
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value; //so that it only gets the value of the tag that has input[name=""] that is checked
                                break;
                            case 'checkbox':    //because this is checkbox, it should return an array of answers that user chooses, not individual answer like radio anymore
                                if(!input.matches(':checked')){  
                                    values[input.name] = '';    //this is so that if user ain't check any box it still returns an empty array gender
                                    return values;              //this step is to see if user checked that box since we only wanna get boxes that are checked. If they ain't check it the return will run and ignore the rest
                                }
                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];    //if it's not an array yet, turn it into an empty array
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;                                                                       
                }, {});

                options.onSubmit(formValues);
            }
                //This is submitting with the default browser
            else {
                formElement.submit()
            } 
                    
                
                
                
        }
    }
}       


        //Loops through each rule and handle event listener (blur, input, etc...) 
        options.rules.forEach(function(rule){
            
            //save rule for each input 
            
            //Need to create an algorithm that adds rules for the input element accordingly
            
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)        //the push method automatically gets array, so the thing inside it is already an array
            } else {
                selectorRules[rule.selector] = [rule.test]
            }
            
            var inputElements = formElement.querySelectorAll(rule.selector) //formElement because we only wanna take info from this form-1, since we might have multiple forms
            
            //inputElements now is a node list becuase of querySelectorAll, we want an array
            Array.from(inputElements).forEach(function(inputElement) {
                //When blur out of input field
                inputElement.onblur = function(){
                    validate(inputElement, rule)

                    }

                //When start inputting
                inputElement.oninput = function(){  //oninput is triggered when we click on the input field
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)  //inputElement.parentElement gets the div tag that contains the inputElement tag
                    errorElement.innerText = ''
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')

                }
            });
            
            

            });
            
    

}

// Define the rules
// Principles of rules:
// 1. When error: return error message
// 2. When valid: return nothing (undefined)
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value){                                  //work flow: pass the value from input into the test function
            return value ? undefined : message || 'Please type'    //Ternary operator   trim() to remove all the spaces
        },
    }
}

Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var regrex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regrex.test(value) ? undefined : message || 'Leave an appropriate email'
        },
    }
}

Validator.minLength = function(selector, min, message){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message || 'Needs at least 6 characters'
        },
    }
}

Validator.isConfirmed = function(selector, getConfirmed, message){
    return {
        selector: selector,
        test: function(value){
            return value == getConfirmed() ? undefined : message || 'The input is not precise'
        },
    }
}