import { Component, signal, OnInit } from '@angular/core';
import { DataService } from './services/data'; // call service because is have the information
import { MatTableModule } from '@angular/material/table'; // import Angular Material becouse my version of angular is signal
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; //for using [(ngModel)]
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true, // You should write to understud is Standalone Component
  imports: [
    MatTableModule,
    NgChartsModule,
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class App implements OnInit {
  protected readonly title = signal('List Of Jobs');

  Jobs: any[] = [];
  filteredJobs: any[] = [];
  locations: string[] = [];
  selectedLocation: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  levelCounts: { [level: string]: number } = {};
  levelLabels: string[] = [];
  levelData: number[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getJobs().subscribe({
      next: (data) => {
        this.Jobs = data;
        this.filteredJobs = data;
        this.extractLocations(data);
        this.chartData();
        // console.log('the jobs is:', this.Jobs);
      },
      error: (err) => console.error('error when fetch jobs', err),
    });
  }
  // the benift of 'subscribe' is wait the data from api when is comming put on the Jobs
  //next: (data)==> it is mean when data is sucssful coming after then stor on Jobs

  // i say for table this is column and you should apaerrenc excatly

  displayedColumns: string[] = [
    'name',
    'company',
    'location',
    'level',
    'type',
    'link',
  ];

  extractLocations(data: any[]) {
    const locs = data
      .map((job) => job.locations[0]?.name)
      .filter((name) => !!name);
    this.locations = Array.from(new Set(locs));
  }
  // .filter is used to exclusion any job whit out value('',null,undefine) >>then using !! to repleas the value to bpplean
  // this.locations = Array.from(new Set(locs)); ==>first store locs into (new Set) array to delete deplecait after then using (Array.from) to transfer the array type from array (new set ) to natural array to can use in angular

  filterByLocation() {
    if (this.selectedLocation === '') {
      this.filteredJobs = this.Jobs;
    } else {
      this.filteredJobs = this.Jobs.filter((job) =>
        job.locations?.some((loc: any) => loc?.name === this.selectedLocation)
      );
    }
  }

  sortByJobName() {
    if (this.sortDirection === 'asc') {
      this.filteredJobs = [
        ...this.filteredJobs.sort((a, b) => {
          const result = a.name.localeCompare(b.name);
          //console.log( {result});
          return result;
        }),
      ];
      this.sortDirection = 'desc';
    } else {
      this.filteredJobs = [
        ...this.filteredJobs.sort((a, b) => {
          const result = b.name.localeCompare(a.name);
          //console.log({result});
          return result;
        }),
      ];
      this.sortDirection = 'asc';
    }
    // console.log('sorting by according:', this.sortDirection);
  }
  //(...this.filteredJobs)=> it is mean the new copy of filteredJobs array
  // localeCompare => it is function using with string to comper between tow words according languge=>return -1 if a then b ,1 if b then a ,0 if a=b

  chartData() {
    this.levelCounts = {};

    this.Jobs.forEach((job) => {
      const levelName = job.levels[0]?.name || 'undifine';
      this.levelCounts[levelName] = (this.levelCounts[levelName] || 0) + 1;
    });

    this.levelLabels = Object.keys(this.levelCounts);
    this.levelData = Object.values(this.levelCounts);
  }
}

//constructor is function when using in angular it is mean what the service needed inject insid component , so i say take my data from Data and make the copy into dataService brcuse th dataService is verable
// 'this.dataService.getData()' hear call getData() that write insid 'import { Data } from './services/data';'insid this you should rerember i used 'Observable' it is mean the data maybe late ..when is comming implement 'subscribe'
// the benfit when using 'OnInit'  when the page is show after then you can implement the code insid the 'OnInit'..so you can write insid 'OnInit' the api code or data service is the brtter way
