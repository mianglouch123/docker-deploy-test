import { Directive , OnInit , OnDestroy , input , inject, ViewContainerRef , TemplateRef } from "@angular/core";

@Directive({
 selector : '[appShowOnScreenSize]', // las directivas van embueltas de un []
 standalone : true
})

export class ShowOnScreenSizeDirective implements OnInit , OnDestroy {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);

  appShowOnScreenSize  = input.required<'large' | 'medium' | 'small'>();
  hasView : boolean = false;

  updateView = () => {
    const width = window.innerWidth;
    const shouldShow = this.canView(width);

     if(shouldShow && !this.hasView) {
      this.viewContainerRef.createEmbeddedView(this.templateRef)
      this.hasView = true;
     }
     if(!shouldShow && this.hasView) {
      this.viewContainerRef.clear();
      this.hasView = false;
     }
     
  }
  
  canView(width : number) : boolean{
    const size = this.appShowOnScreenSize();

    if (size === 'small') {

    return width < 600; // Celulares
    }
    if (size === 'medium') {
      return width >= 600 && width <= 1024; // Tablets
    }
    if (size === 'large') {
      return width > 1024; // Computadoras / Pantallas grandes
    }
    return false;
  }

  ngOnInit(): void {
   window.addEventListener('resize' , this.updateView)
  }

  ngOnDestroy(): void {
   window.removeEventListener('resize', this.updateView)
  }
   

}