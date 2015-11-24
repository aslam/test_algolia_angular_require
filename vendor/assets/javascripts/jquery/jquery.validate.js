define(["jquery", "textstrings"], function($, TextStrings) {

(function($){
    var V= $.lsValidate= function(){ 

        V.open.apply(this, arguments);
    };
           
    $.extend(V, {
        _path: 'form',
        _labelInInput: false,
        _requiredField: false,
        _isEmptyField: false,
        _isEmailField: false,
        _isMobileField: false,
        _isMatch: false,
        _isNumber: false,
        _errorLoc: null,
        _errorMsg: null,

        errorMessages: {
            username: TextStrings.validation.username,
            firstname: TextStrings.validation.firstname,
            lastname: TextStrings.validation.lastname,
            fullname: TextStrings.validation.fullname,
            password: TextStrings.validation.password,
            old_password: TextStrings.validation.oldPassword,
            new_password: TextStrings.validation.newPassword,
            password_length: TextStrings.validation.passwordLength,
            confirm_password: TextStrings.validation.confirmPassword,
            password_match: TextStrings.validation.passwordMatch,
            email: TextStrings.validation.email,
            phone: TextStrings.validation.phone,
            comments: TextStrings.validation.comments,
            invalidEmail: TextStrings.validation.invalidEmail,
            link_title: TextStrings.validation.linkTitle,
            link_url: TextStrings.validation.linkUrl,
            invalidURL: TextStrings.validation.invalidURL,
            invalidphone: "Please enter a valid phone number",
            textArea: TextStrings.validation.textArea,
            copy_caption: TextStrings.validation.copyCaption,
            options: TextStrings.validation.options,
            defaults: TextStrings.validation.defaults
        },

        open : function(optns){
            $.fancybox({
                lsType: 'alert',
                wrapCSS: 'warning', 
                title: 'Validation Functions', 
                message: '<strong>Examples:</strong><br /><br />' +
                        '<strong>Enclosed Label:</strong> $.lsValidate.enclosedLabel({"path":"value"})<br />' +
                        '<strong>Empty Field:</strong> $.lsValidate.isEmpty({"path":"value", "errorLoc":"value", "errorMsg":"Error Message"})<br />' +
                        '<strong>Email Field:</strong> $.lsValidate.isEmail({"path":"value"})<br />'+
                        '<strong>Mobile Field:</strong> $.lsValidate.isMobile({"path":"value"})<br />'+
                        '<strong>Password Match:</strong> $.lsValidate.isPasswordMatch(pwd, confirmPwd)<br />'+
                        '<strong>Input Limit:</strong> $.lsValidate.descriptionLimit(descField, charLimit, errorMsg)<br />',
                cancel: TextStrings.lightbox.done
            });
        },

        enclosedLabel: function(optns){
            var path = optns.path || V._path;
            var labelInInputField;
            if($(path).hasClass('text')){
                if($(path).parents('.clearfix').length >0){
                    labelInInputField = $(path);            
                }
            }else if($(path).hasClass('clearfix')){
                labelInInputField = $(path).find('input.text');
                if(!$(labelInInputField).hasClass('text')){
                    return true;
                }
            }else{
                labelInInputField = $(path).find('.clearfix input.text');
                if(!$(labelInInputField).hasClass('text')){
                    return true;
                }
            }
            
            labelInInputField.each(function(){
                var self = $(this);
                var parent = self.parent();
                // Check on Function call
                setTimeout(function(){
                    if($(self).val()!=""){
                        $(self).siblings('label').hide();
                    }
                },250);
                
                //Check on click on inputfield
                //need to find a better way to do below excluding chat input field
                var id=self.attr('id');
                if(id!=="new_comment"){
                    V._enclosedClickEvent(self);
                }           
                
                //Check when type in inputfiled
                self.keyup(function(){
                    var inputVal = $(this);
                    var inputSibling = inputVal.siblings('label');
                    if(inputVal.val()!=""){
                        inputSibling.hide();
                        inputVal.parent().addClass('in-focus');
                    } else{
                        inputSibling.fadeIn(250);
                    }
                });
                self.focusin(function(){
                    parent.addClass('in-focus');
                    V._enclosedClickEvent(self);
                });
                self.blur(function() {
                    parent.removeClass('in-focus');
                });
            });
        },

        _enclosedClickEvent: function(self){
            var checkInterval;
            self.bind('click', function(){
                self.unbind('click');
                var inputVal = $(this);
                var inputSibling = inputVal.siblings('label');
                checkInterval = setInterval(function(){
                    if(inputVal.val()!=""){
                        inputSibling.hide();
                        inputVal.parent().addClass('in-focus');
                        clearInterval(checkInterval)
                    } else{
                        inputSibling.fadeIn(250);
                        inputVal.trigger('click');
                    }
                },150);
            });
            self.blur(function() {
                clearInterval(checkInterval);
            });
        },

        isEmpty: function(optns){
            var reqField= optns.path || optns || V._path,
                errorPath= optns.errorLoc || '',
                showErrorMsg= optns.errorMsg || ''; 
            var self, showMsg, errorMsgEle, parent, fieldType, valid = true;
            $(reqField).each(function(){    
                self = $(this);
                errorMsgEle = self;
                parent = self.parent();
                if(errorPath != ""){
                    errorMsgEle = $(errorPath); 
                    parent = $(errorPath).parent();
                }
                fieldType = self.attr('data-field');
                parent.removeClass('error');
                errorMsgEle.siblings('.error_msg').remove();
                if(self.val()==""){
                    parent.addClass('error');
                    if(showErrorMsg == ""){
                        if(V.errorMessages[fieldType]){
                            showMsg = V.errorMessages[fieldType];
                            $(errorMsgEle).after('<p class="error_msg">'+ showMsg +'</p>').end().siblings('.note').remove();
                            valid = false;
                            return true;
                        }
                        showMsg = V.errorMessages['defaults'];
                        $(errorMsgEle).after('<p class="error_msg">'+ showMsg +'</p>').end().siblings('.note').remove();
                        valid = false;
                        return true;
                    }else{
                        showMsg = showErrorMsg;
                        $(errorMsgEle).after('<p class="error_msg">'+ showMsg +'</p>').end().siblings('.note').remove();
                        valid = false;
                        return true;
                    }                   
                }else if(fieldType == 'email'){
                    if(!V._validateEmailAddress($(this))){
                        parent.removeClass('error');
                        errorMsgEle.siblings('.error_msg').remove();
                        if(V.errorMessages[fieldType]){
                            parent.addClass('error');
                            showMsg = V.errorMessages['invalidEmail'];
                            $(errorMsgEle).after('<p class="error_msg">'+ showMsg +'</p>').end().siblings('.note').remove();
                            valid = false;
                            return true;
                        }
                    }
                }else if(fieldType == 'phone'){
                    if(!V.isMobile(optns)){
                        parent.removeClass('error');
                        errorMsgEle.siblings('.error_msg').remove();
                        if(V.errorMessages[fieldType]){
                            parent.addClass('error');
                            showMsg = V.errorMessages['invalidphone'];
                            $(errorMsgEle).after('<p class="error_msg">'+ showMsg +'</p>').end().siblings('.note').remove();
                            valid = false;
                            return true;
                        }
                    }
                }

            });
            return valid;
        },

        isPasswordLengthMatch: function(optns){
            var reqField= optns.path || optns || V._path,
                errorPath= optns.errorLoc || '';
            var self, errorMsgEle, parent, fieldType, valid = true;
            $(reqField).each(function(){    
                self = $(this);
                errorMsgEle = self;
                parent = self.parent();
                if(errorPath != ""){
                    errorMsgEle = $(errorPath); 
                    parent = $(errorPath).parent();
                }
                fieldType = self.attr('data-field');
                parent.removeClass('error');
                errorMsgEle.siblings('.error_msg').remove();
                if(fieldType == 'password'){
                    if(self.val().length<6){
                        parent.addClass('error');
                        $(errorMsgEle).after('<p class="error_msg">'+ V.errorMessages['password_length'] +'</p>').end().siblings('.note').remove();
                        valid = false;
                        return true;
                    }
                }
            });
            return valid;
        },

        isEmail: function(optns){
            var emailField, self, fieldType,
                path = optns.path || V._path;
            $(path).each(function(){
                self = $(this);
                
                if(self.hasClass('email')){
                    emailField = self ;
                }else{
                    emailField = $(path).find('input.email');
                    if(!$(emailField).hasClass('email')){
                        return true;
                    }
                }
                emailField.focusin(function(){
                    $(this).parent().removeClass('error');
                    $(this).siblings('.error_msg').remove();
                });
                emailField.blur(function(){
                    if($(this).val() != '' && !V._validateEmailAddress($(this))){
                        $(this).parent().removeClass('error').addClass('error');
                        fieldType = $(this).attr('data-field');
                        if(V.errorMessages[fieldType]){
                            showMsg = V.errorMessages['invalidEmail'];
                            $(this).siblings('.error_msg')
                                   .remove()
                                   .end()
                                   .after('<p class="error_msg">'+ showMsg +'</p>');
                        }
                    }
                });
            });
        },

        _validateEmailAddress: function(id){
            var email = id.val();
            if (email.indexOf("_") == 0)
                return false;
            var atPos = email.indexOf("@");
            if (email[atPos + 1] == "_")
                return false;
            var emailReg = /^[a-z0-9_\+-]+(\.[a-z0-9_\+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,10})$/i;
            var regex = new RegExp(emailReg);
            return regex.test(email);
        },

        isMobile: function(optns){
            var isNum,
                path = optns.path || V._path;
            $(path).each(function(){
                self = $(this);
                if($(this).hasClass('mobile')){
                    mobileField = self ;
                }else{
                    mobileField = $(path).find('.mobile');
                    if(!$(mobileField).hasClass('mobile')){
                        return true;
                    }
                }
                return mobileField.each(function() {
                    $(this).keypress(function(e) {
                        
                        var key = String.fromCharCode(e.keyCode ? e.keyCode : e.charCode);
                        var pattern = /^[0-9()+\s-]*$/;
                        isNum = pattern.test(key);
                        
                        if(isNum || e.keyCode == 8 || e.keyCode == 13 ){
                            return key;
                        }else{
                            e.preventDefault();
                        }
                    });
                });
            });
        },

        isPasswordMatch: function(pwd, confirmPwd){
            var password, confirmPassword, password_length, fieldType, minlength = 6, valid = true;
            password = $('#'+pwd).val();
            confirmPassword = $('#'+confirmPwd).val();
            password_length = password.length;
            if(password_length < minlength){
                $('#'+pwd).parent().removeClass('error').addClass('error');
                fieldType = $('#'+pwd).attr('data-field');
                if(V.errorMessages[fieldType]){
                    showMsg = V.errorMessages['password_length'];
                    $('#'+pwd).siblings('.error_msg')
                                   .remove()
                                   .end()
                                   .after('<p class="error_msg">'+ showMsg +'</p>');
                    valid = false;
                    return false;
                }
                valid = false;
                return true;
            } else if(password !== confirmPassword){
                $('#'+confirmPwd).parent().removeClass('error').addClass('error');
                fieldType = $('#'+confirmPwd).attr('data-field');
                if(V.errorMessages[fieldType]){
                    showMsg = V.errorMessages['password_match'];
                    $('#'+confirmPwd).siblings('.error_msg')
                                     .remove()
                                     .end()
                                     .after('<p class="error_msg">'+ showMsg +'</p>');
                    valid = false;
                    return false;
                }
                valid = false;
                return true;
            }
            return valid;
        },

        // This allows user to enter only number value in passed input field id or class
        forceNumber: function(obj, isBlank){
            var inNum;
            $(obj).each(function(){
                var self = $(this);
               self.keypress(function(e) {
                    var key = String.fromCharCode(e.keyCode ? e.keyCode : e.charCode);
                    var pattern = /^[0-9]*$/;
                    isNum = pattern.test(key);

                    if(isNum || e.keyCode == 8 || e.keyCode == 13 || e.keyCode == 9 ||  e.keyCode == 46){
                        return key;
                    }else{
                        e.preventDefault();
                    }
                });
                self.blur(function(e){
                    (isBlank) ? ((self.val()=="") ? self.val() : "") : ((self.val()=="") ? self.val(0) : "");
                });
            });
        },
        
        // This function allows user to enter only 0 to 59 range in provided input field id or class
        forceNumberRange: function(obj){     
           var inNum;
           V.forceNumber(obj);
            $(obj).keyup(function(e) {
                var intialKey = $(this).val();
                if(intialKey.length ==2){
                        var keyVal = $(this).val();
                        var pattern=/^0?([0-9]|[1-5][0-9])$/;
                        isNum = pattern.test(keyVal);
                        if(isNum || e.keyCode == 8 || e.keyCode == 13 ){
                            return keyVal;
                        }else{
                            $(this).val(0);
                            e.preventDefault();
                        }
                }else if(intialKey > 2){
                  e.preventDefault();
                }
            });
        },
        
        //Validation function for highlight post video and edit post video.
        startEndTime: function(obj1, obj2){
            var startTime=0, endTime=0, force_number, force_range, isCorrect = true;
            $(obj1).each(function(){
                force_number = $(this).attr('data-field');
                if(force_number == "copy_in_hour"){
                    startTime += Number($(this).val())*3600;
                    
                }
                if(force_number == "copy_out_hour"){
                    endTime += Number($(this).val())*3600;
                }
            });
            $(obj2).each(function(){
                force_range = $(this).attr('data-field');
                if(force_range == "copy_in_min"){
                    startTime += Number($(this).val())*60;
                }
                if(force_range == "copy_out_min"){
                    endTime += Number($(this).val())*60;
                }
                if(force_range == "copy_in_sec"){
                    startTime += Number($(this).val());
                }
                if(force_range == "copy_out_sec"){
                    endTime += Number($(this).val());
                }
            });
            if(startTime >= endTime){
                $('.out_sec').parent()
                             .removeClass('error')
                             .addClass('error')
                             .end()
                             .siblings('.error_msg')
                             .remove()
                             .end()
                             .after('<p class="error_msg">'+TextStrings.validation.startEndTime+'</p>');
                isCorrect = false;
            }else{
                $('.out_sec').parent()
                             .removeClass('error')
                             .end()
                             .siblings('.error_msg')
                             .remove()
            }
            return isCorrect;
        },

        /*
            Description counter sets maximum limit for the input/textarea field and if limit exceed, gives error state
            descField = inputField or textarea / .class / #id
            charLimit = Maximum limit. ie. 300
            errorMsg = error message or character limit exceed
        */
        descriptionLimit: function(descField, charLimit, errorMsg){
            var self = $(descField);
            var parent = self.parent();
            self.keyup(function(event){
                var descLen = self.val().length;
                if(descLen > charLimit){
                    if(!parent.hasClass('error')){
                        parent.addClass('error').append('<p class="error_msg">'+errorMsg+'</p>');   
                    }
                }else{
                    parent.removeClass('error').find('.error_msg').remove('.error_msg');
                }
            }); 
        },

        suggestMail: function(emailField) {
            emailField.blur(function(event) {
                emailField.val($.trim(emailField.val()))
                $(this).mailcheck({
                    suggested: function(element, suggestion) {
                        var target = $(event.target);
                        if(target.attr("data-previous") != target.val()) {
                            target.parent().children('.error_msg').remove();
                            target.after('<p class="error_msg">'+TextStrings.validation.suggestMail + decodeURIComponent(suggestion.full) + '?</p>');
                            target.parent().addClass('warning');
                        }
                    },
                    empty: function(element) {
                    }
                });
            });

            emailField.focus(function(event) {
                var target = $(event.target), parent = target.parent();
                
                target.attr("data-previous", target.val());
                if(parent.hasClass('warning')) {
                    parent.removeClass('error');
                    parent.removeClass('warning');
                    parent.children('.error_msg').remove();
                }
            });
        },

		isIP: function(ipField){
			var isValid = true;
			$(ipField).each(function(){
				var self = $(this),
					parent = self.parent();
				var inputVal = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(self.val());
				if(!inputVal){
					isValid = false;
					if(!parent.hasClass('error')){
						 parent.addClass('error').append('<p class="error_msg"> Invalid IP</p>');
					}
				}else{
					parent.removeClass('error').find('.error_msg').remove('.error_msg');
				}
			})
			return isValid;
		},

        isValidColor: function(inputField){
            var self = $(inputField), hexValue;
            var parent= self.parent();
            self.live('blur', function(){
                var value = $.trim(self.val());
                if(value !== ""){
                    if(value[0] !== '#') {
                        value = "#"+value;
                        self.val(value);
                    }
                    var iscorrectValue = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
                    if(!iscorrectValue){
                        if(!parent.hasClass('error')){
                             parent.addClass('error').append('<p class="error_msg">'+TextStrings.validation.invalid_color_code+'</p>');
                        }
                    }else{
                        parent.removeClass('error').find('.error_msg').remove('.error_msg');
                    }
                }
            });
        },

        // validate URL format
        isValidUrl : function (inputField) {
            var isValid = true;
            $(inputField).each(function(){
                var self = $(this),
                    parent = self.parent();
                var urlRegExpression = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
                var inputVal = urlRegExpression.test(self.val());
                if (!inputVal) {
                    isValid = false;
                    if(!parent.hasClass('error')){
                         parent.addClass('error').append('<p class="error_msg">' + V.errorMessages['invalidURL'] + '</p>');
                    }
                }else{
                    parent.removeClass('error').find('.error_msg').remove('.error_msg');
                }
            })
            return isValid;
        }
    });
       
})(jQuery);

});
