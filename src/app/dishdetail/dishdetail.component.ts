import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


// Data import 
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

// animations
import { flyInOut, visibility, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [visibility(),
    flyInOut(),
    expand()],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string; 
  visibility = 'shown';

  // Form building  and validation 
  commentForm: FormGroup;
  comment: Comment;
  dishcopy: Dish;

  // Objets for error messages 
	formErrors = {
		'author': '',
    'comment': ''

	};

	validationMessages = {
		'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.'
		},
    'comment': {
      'required':     'Comment is required.'
    },
	};


  // Get access to the form DOM
  @ViewChild('cform') commentFormDirective;
  

  constructor(private dishService: DishService,
    private location: Location,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
      this.createForm();
    }

  ngOnInit(): void {
    
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    
    this.route.params.pipe(
      switchMap((params: Params) => 
      {this.visibility = 'hidden'; return this.dishService.getDish(params['id']);}))
      .subscribe(dish => {this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility='shown';},
        errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length]
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length]

  }

  goBack(): void {
    this.location.back();
  }

  /**
   * Create comment form with validation 
   */
  createForm(): void {
    this.commentForm = this.formBuilder.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.max(25)]],
      rating: 1,
      comment: ['', Validators.required]   
    });

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    
    this.onValueChanged();

  }

  /**
   * Resetting of form through directly upon submission
   * 
   */
  onSubmit() : void {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toDateString();
    this.dishcopy.comments.push(this.comment);

    //PUT operation onto server for persistence of comment onto 
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy=dish;
      }, 
      errmess => {this.dish = null; this.dishcopy = null; this.errMess=<any>errmess});


    this.commentForm.reset({
      author: '',
      rating: 0,
      comment: ''
    })
    this.commentFormDirective.resetform();
  }

  /**
   * 
   * @param data placehold for Observable stream  
   * @returns 
   */
  onValueChanged(data?: any) : void {
    if (!this.commentForm) {return;}
    const form = this.commentForm;

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
    this.comment = form.value;
    this.comment.date = new Date().toDateString();
  }


}
