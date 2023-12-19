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

        var rules = selectorRules[rule.selector]
        for(i=0; i<rules.length; ++i){
            errorMessage = rules[i](inputElement.value) //rules here is function so the inputElement.value is parameter
            if (errorMessage) break;
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
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
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
                        (values[input.name] = input.value)                                          //so we can use reduce method to get out every of each value in enableInputs 
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
            
            var inputElement = formElement.querySelector(rule.selector) //formElement because we only wanna take info from this form-1, since we might have multiple forms
            
            //
            
            
            if (inputElement){

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

                    
                }

            }
            
            )
            
    

}

// Define the rules
// Principles of rules:
// 1. When error: return error message
// 2. When valid: return nothing (undefined)
Validator.isRequired = function(selector, message   ){
    return {
        selector: selector,
        test: function(value){                                  //work flow: pass the value from input into the test function
            return value.trim() ? undefined : message || 'Please type'    //Ternary operator   trim() to remove all the spaces
        },
    }
}

Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var regrex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regrex.test(value) ? undefined : message || 'Leave an aappropriate email'
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