import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StatistiqueService } from '../../services/statistique.service';

@Component({
  selector: 'app-statistique',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgApexchartsModule
  ],
  templateUrl: './statistique.component.html',
  styleUrl: './statistique.component.css'
})
export class StatistiqueComponent implements OnInit {
  // Chart options
  chartOptions: any;
  filters = { dateMin: '', dateMax: '' };

  constructor(private statistiqueService: StatistiqueService) {}

  ngOnInit(): void {
    this.loadTauxOccupation();
  }
  loadTauxOccupation() {
    this.statistiqueService.getTauxOccupation(this.filters).subscribe(data => {
      const maxValue = Math.max(...data.map((mecano: any) => mecano.totalActions), 1); // Évite un max de 0
        console.log("data = ",data);
      this.chartOptions = {
        series: [{
          name: "Nombre de tâches",
          data: data.map((mecano: any) => mecano.totalActions)
        }],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "70%"
          }
        },
        xaxis: {
          categories: data.map((mecano: any) => `${mecano.nom} ${mecano.prenom}`),
          title: {
            text: "Mécaniciens",
            style: {
              fontSize: '14px',
              fontWeight: 'bold'
            }
          }
        },
        yaxis: {
          min: 0,
          max: maxValue, // Définit la valeur max basée sur le nombre max de tâches
          tickAmount: maxValue, // Crée exactement maxValue ticks
          labels: {
            formatter: (value: number) => {
              // Convertir en entier sans décimale
              return Math.floor(value).toString();
            }
          },
          title: {
            text: "Nombre de tâches",
            style: {
              fontSize: '14px',
              fontWeight: 'bold'
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          enabled: true
        }
      };
    });
  }


  onDateChange() {
    this.loadTauxOccupation(); 
  }
}
