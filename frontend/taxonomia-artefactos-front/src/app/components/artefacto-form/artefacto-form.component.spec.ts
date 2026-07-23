import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtefactoFormComponent } from './artefacto-form.component';

describe('ArtefactoFormComponent', () => {
  let component: ArtefactoFormComponent;
  let fixture: ComponentFixture<ArtefactoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtefactoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtefactoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
