import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtefactosComponent } from './artefactos.component';

describe('ArtefactosComponent', () => {
  let component: ArtefactosComponent;
  let fixture: ComponentFixture<ArtefactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtefactosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtefactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
