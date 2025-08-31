import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import {
  animationFrameScheduler,
  BehaviorSubject,
  combineLatest,
  switchMap,
  map,
  interval,
  takeWhile,
  endWith,
  distinctUntilChanged,
  takeUntil,
  Subject,
} from 'rxjs';

@Directive({
  selector: '[ymiCountUp]',
})
export class CountUpDirective implements OnInit, OnDestroy {
  private readonly count$ = new BehaviorSubject(0);
  private readonly duration$ = new BehaviorSubject(2000);
  private destroyed$ = new Subject();
  private lastValue = 0;


  private readonly currentCount$ = combineLatest([this.count$, this.duration$]).pipe(
    // switchMap(([count, duration]) => {

        switchMap(([endValue, duration]) => {
    const startValue = this.lastValue; // <-- נשמר מהאנימציה הקודמת
    const changeInValue = endValue - startValue;


      // get the time when animation is triggered
      const startTime = animationFrameScheduler.now();

      return interval(0, animationFrameScheduler).pipe(
        // calculate elapsed time
        map(() => animationFrameScheduler.now() - startTime),
        // calculate progress
        map(elapsedTime => elapsedTime / duration),
        // complete when progress is greater than 1
        takeWhile(progress => progress <= 1),
        // apply quadratic ease-out
        // for faster start and slower end of counting
        map((x: number): number => x * (2 - x)),
        // calculate current count
        // map(progress => Math.round(progress * count)),

        map(progress => Math.round(startValue + progress * changeInValue)),
        // make sure that last emitted value is count
        // endWith(count),
              endWith(endValue),

        distinctUntilChanged(),
      );
    }),
  );

  @Input('ymiCountUp')
  set count(count: number) {
    this.count$.next(count);
  }

  @Input()
  set duration(duration: number) {
    this.duration$.next(duration);
  }

  constructor(private readonly elementRef: ElementRef, private readonly renderer: Renderer2) {}

  ngOnInit(): void {
    this.displayCurrentCount();
  }

  private displayCurrentCount(): void {
    this.currentCount$.pipe(takeUntil(this.destroyed$)).subscribe(currentCount => {
          this.lastValue = currentCount; // נשמר כבסיס לאנימציה הבאה
      this.renderer.setProperty(
        this.elementRef.nativeElement,
        'innerText',
        Number(Math.round(currentCount).toFixed(0)).toLocaleString(),
      );
    });
  }
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
