import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bienestar } from './bienestar';

describe('Bienestar', () => {
  let component: Bienestar;
  let fixture: ComponentFixture<Bienestar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bienestar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bienestar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
