import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { Category  } from "src/app/core/models/category.model";
import { Location } from "@angular/common";
import { ActivatedRoute ,Router} from "@angular/router";
import { Filters } from "src/app/core/models/filters.model";
import { ProductComponent } from "../product/product.component";
import { of } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ChangeDetectionStrategy } from "@angular/compiler";
import { UserService } from "src/app/core";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss']
})export class FiltersComponent {
    url_filters?: string = '';
    filters!:Filters;
    selected?: string;
    object!:{};
    home_category?: number;
    state_highlight?: String;
    pricemin_highlight?: number;
    pricemax_highlight?:number;
    ref_Category: String = '';
    view_filters: boolean = true;
    
    //filtersForm: FormGroup;

    @Input() listcategory: Category[] = [];
    @Input() filters_change!: string ;
    @Output() filterEvent: EventEmitter<Filters> = new EventEmitter();
   

    constructor(private productcomp: ProductComponent,
            private ActivatedRoute: ActivatedRoute,
            private Router: Router,
            private location: Location,
            private FormBuilde: FormBuilder,
            private prodComp: ProductComponent,
            private cd: ChangeDetectorRef,
            private userService: UserService,
            private ToastrService: ToastrService
            ) {
                this.url_filters = this.ActivatedRoute.snapshot.params['filters'] || '' ;
                if (this.url_filters == '') {
                    this.ActivatedRoute.url.subscribe((data) => {
                        if (data[1].path) {
                            setTimeout(() => {
                                this.home_category = parseInt(data[1].path)
                            }, 100);
                        }
                    })
                } 
                this.ref_Category = this.ActivatedRoute.snapshot.paramMap.get('id') || ''
                //console.log(this.filters_change)
            }

    ngOnInit(): void {
        if (this.ref_Category === "favorites"){
            this.userService.isAuthenticated.subscribe({
                next: (authenticated) => {
                    if (!authenticated) {
                        this.Router.navigateByUrl('/auth/login');
                        this.ToastrService.error("YOU MUST LOG IN YOUR ACCOUNT");
                        //return of(null);
                    }
                }
            })
            this.view_filters = false;
        }else {
            this.start_filters();
        }
    }

    start_filters() {
        this.ActivatedRoute.url.subscribe((data) => {
            if (data[1].path) {
                this.home_category = parseInt(data[1].path)
                if (this.home_category < 0) {
                    this.replaceEmit({"listcategory":undefined})
                } else {
                    this.replaceEmit({"listcategory":this.home_category.toString()})
                }
            } 
        })
        if (this.url_filters) {
            this.filters = JSON.parse(atob(this.url_filters));
            this.home_category = Number(this.filters.listcategory)
            this.state_highlight = String(this.filters.state)
            this.pricemin_highlight = this.filters.priceMin;
            this.pricemax_highlight = this.filters.priceMax;
        } else {
            this.home_category = -1
            this.state_highlight = "0"
        }
    }

    checkTime(filters: any) {
        setTimeout(() => {
        if (filters === this.filters) this.replaceEmit(this.filters);
        }, 50);
    }

    public onchange(value: any): void {

        this.filters = new Filters();
        
        this.url_filters = this.ActivatedRoute.snapshot.params['filters'] || '' ;

        if (this.url_filters) {
            this.filters = JSON.parse(atob(this.url_filters));
            //console.log(this.filters)
        }

        if (value.target.id === "priceMin") {
            //console.log(value.data)
            this.filters.priceMin = value.target.value;
            ////console.log("PRICE")
        }
        if (value.target.id === "priceMax") {
            this.filters.priceMax = value.target.value;
            ////console.log("PRICE")
        }
        if (value.target.id === "cate") {
            if (value.target.value == -1) {
                this.filters.listcategory = undefined;   
            } else {
                this.filters.listcategory = value.target.value;
            }
            
        }

        if (value.target.id === "state") {
            this.filters.state = value.target.value;
            ////console.log("STATE")
        }
        
         this.checkTime(this.filters);
    }

    public delete() {
        this.location.replaceState('/shop/e30')
        window.location.reload()
    }
    replaceEmit(filters: any) {
        this.location.replaceState('/shop/'  + btoa(JSON.stringify(filters)))
        console.log(filters)
        this.filterEvent.emit(filters)
        window.location.reload()
    }
}