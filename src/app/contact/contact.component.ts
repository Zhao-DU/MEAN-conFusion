import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { flyInOut } from '../animations/app.animation';
import { Feedback, ContactType } from '../shared/feedback';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut()
    ]
})
export class ContactComponent implements OnInit {
  
	feedbackForm: FormGroup;
	feedback: Feedback;
	contactType = ContactType;

	// Get access to the form DOM
	@ViewChild('fform') feedbackFormDirective;

	
	// Objets for error messages 
	formErrors = {
		'firstname': '',
		'lastname': '',
		'telnum': '',
		'email': ''
	};

	validationMessages = {
		'firstname': {
		'required':      'First Name is required.',
		'minlength':     'First Name must be at least 2 characters long.',
		'maxlength':     'FirstName cannot be more than 25 characters long.'
		},
		'lastname': {
		'required':      'Last Name is required.',
		'minlength':     'Last Name must be at least 2 characters long.',
		'maxlength':     'Last Name cannot be more than 25 characters long.'
		},
		'telnum': {
		'required':      'Tel. number is required.',
		'pattern':       'Tel. number must contain only numbers.'
		},
		'email': {
		'required':      'Email is required.',
		'email':         'Email not in valid format.'
		},
	};

	// createForm called in the constructor of the component
		constructor(private formBuilder: FormBuilder) {
		this.createForm();
		}

	ngOnInit(): void {
	}

	/**
	 * Create form in template HTML, along with require validators for each field
	 */
	createForm() : void {
		this.feedbackForm = this.formBuilder.group({
			firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
			lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
			telnum: [0, [Validators.required, Validators.pattern]],
			email: ['', [Validators.required, Validators.email]],
			agree: false,
			contacttype: 'None',
			message: ''
		});

		this.feedbackForm.valueChanges
			.subscribe(data => this.onValueChanged(data));

		this.onValueChanged();
	}

	/**
	 *  Reset form when submitted 
	 */
	onSubmit() {
		// so happens that properties are the same, so exact map is fine,
		// but otherwise require more processing
		this.feedback = this.feedbackForm.value;
		console.log(this.feedback);
		this.feedbackForm.reset({
				firstname: '',
				lastname: '',
				telnum: 0,
				email: '',
				agree: false,
				contacttype: 'None',
				message:''
		});
		this.feedbackFormDirective.resetform();
	}

	onValueChanged(data?: any){
		if (!this.feedbackForm) {
			 return; }
		const form = this.feedbackForm;
		for(const field in this.formErrors){
			if (this.formErrors.hasOwnProperty(field)){
				this.formErrors[field] = '';
				const control = form.get(field);
				if(control && control.dirty && !control.valid){
				const messages = this.validationMessages[field];
					for (const key in control.errors){
						if (control.errors.hasOwnProperty(key)){
							this.formErrors[field] += messages[key] + ' ';
						}
					}
				}
			}
		}
	}

}


