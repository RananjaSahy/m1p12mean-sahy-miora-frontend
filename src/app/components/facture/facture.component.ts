import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RendezvousMService } from '../../services/rendezvousmanager.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FactureItem {
  id: number;
  item: string;
  price: number;
}

interface Facture {
  items: FactureItem[];
  total: number;
  rendezvous: any;
  utilisateur: any;
  vehicule: any;
}

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit {
  id: string | null = null;
  facture: Facture = { items: [], total: 0, rendezvous: {}, utilisateur: {}, vehicule: {} };
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private rdvService: RendezvousMService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getInvoice(this.id);
    }
  }

  getInvoice(idRendezvous: string): void {
    this.loading = true;
    this.rdvService.getInvoice(idRendezvous).subscribe(
      (response: Facture) => {
        this.facture = response;
        if (!this.facture.items) {
          this.facture.items = [];
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erreur lors de la récupération de la facture', error);
        this.loading = false;
      }
    );
  }

  // formatPrix(prix: number): string {
  //   return new Intl.NumberFormat('fr-FR').format(prix);
  // }

  // downloadPDF(): void {
  //   const doc = new jsPDF();
  //   const { items, total, utilisateur, vehicule } = this.facture;

  //   doc.setFontSize(18);
  //   doc.text(`Facture pour le rendez-vous #${this.id}`, 14, 20);

  //   doc.setFontSize(12);
  //   doc.text(`Client: ${utilisateur?.nom ?? 'Inconnu'} ${utilisateur?.prenom ?? ''}`, 14, 30);
  //   doc.text(`Email: ${utilisateur?.email ?? 'Non renseigné'}`, 14, 35);

  //   doc.text(`Véhicule: ${vehicule?.libelle ?? 'Inconnu'} (${vehicule?.matricule ?? 'Non renseigné'})`, 14, 40);

  //   const columns = ["#", "Service", "Prix"];
  //   const rows = items.map((item: FactureItem) => [
  //     item.id.toString(),
  //     item.item,
  //     this.formatPrix(item.price)
  //   ]);

  //   autoTable(doc, {
  //     head: [columns],
  //     body: rows,
  //     startY: 50,
  //     theme: 'grid',
  //   });

  //   const finalY = (doc as any).lastAutoTable?.finalY || 60;
  //   doc.text(`Net a payer : ${this.formatPrix(total ?? 0)}`, 14, finalY + 10);

  //   doc.save(`facture_rendezvous_${this.id}.pdf`);
  // }

  formatPrix(prix: number): string {
    // Utilisation de `Intl.NumberFormat` pour afficher le prix au format français
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      maximumFractionDigits: 2
    }).format(prix);
  }


  downloadPDF(): void {
    const doc = new jsPDF();
    const { items, total, utilisateur, vehicule } = this.facture;

    // Styles
    const primaryColor = '#3498db';
    const secondaryColor = '#7f8c8d';
    const titleFontSize = 18;
    const subtitleFontSize = 14;
    const normalFontSize = 12;
    const margin = 14;
    let currentY = 20;

    // Logo ou en-tête
    doc.setFontSize(titleFontSize);
    doc.setTextColor(primaryColor);
    doc.text('GARAGE M1P12MEAN', margin, currentY);
    currentY += 10;

    // Sous-titre
    doc.setFontSize(subtitleFontSize);
    doc.setTextColor(secondaryColor);
    doc.text('Facture des services', margin, currentY);
    currentY += 15;

    // Ligne de séparation
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, 200 - margin, currentY);
    currentY += 10;

    // Informations de la facture
    doc.setFontSize(normalFontSize);
    doc.setTextColor(0, 0, 0); // Noir

    // Numéro de facture
    doc.text(`Facture N°: ${this.id}`, margin, currentY);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 110, currentY);
    currentY += 10;

    // Informations client
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT', margin, currentY);
    doc.setFont('helvetica', 'normal');
    currentY += 7;
    doc.text(`Nom: ${utilisateur?.nom ?? 'Inconnu'} ${utilisateur?.prenom ?? ''}`, margin, currentY);
    currentY += 7;
    doc.text(`Email: ${utilisateur?.email ?? 'Non renseigné'}`, margin, currentY);
    currentY += 7;

    // Informations véhicule
    doc.setFont('helvetica', 'bold');
    doc.text('VÉHICULE', margin, currentY);
    doc.setFont('helvetica', 'normal');
    currentY += 7;
    doc.text(`Modèle: ${vehicule?.libelle ?? 'Inconnu'}`, margin, currentY);
    currentY += 7;
    doc.text(`Immatriculation: ${vehicule?.matricule ?? 'Non renseigné'}`, margin, currentY);
    currentY += 15;

    // Tableau des services
    const columns = [
      { header: 'Réf.', dataKey: 'id' },
      { header: 'Description du service', dataKey: 'item' },
      { header: 'Prix (Ar)', dataKey: 'price', align: 'right' }
    ];

    const rows = items.map((item: FactureItem) => ({
      id: item.id.toString(),
      item: item.item,
      price: item.price
    }));

    autoTable(doc, {
      columns: columns,
      body: rows,
      startY: currentY,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        id: { cellWidth: 20 },
        item: { cellWidth: 'auto' },
        price: { cellWidth: 40, halign: 'right' }
      },
      margin: { left: margin, right: margin }
    });

    // Total
    const finalY = (doc as any).lastAutoTable?.finalY || currentY + 50;
    currentY = finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`NET À PAYER: ${total} Ar`, margin, currentY);
    doc.setFont('helvetica', 'normal');
    currentY += 10;

    // Mentions légales
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    currentY += 5;
    currentY += 10;

    // Pied de page
    doc.setDrawColor(secondaryColor);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY, 200 - margin, currentY);
    currentY += 5;
    doc.text('Merci pour votre confiance !', 105, currentY, { align: 'center' });
    currentY += 5;
    doc.text('Garage M1P12MEAN - https://m1p12mean-sahy-miora.netlify.app/', 105, currentY, { align: 'center' });

    // Télécharger la facture en PDF
    doc.save(`Facture_${this.id}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}
