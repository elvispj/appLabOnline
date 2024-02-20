import { Component, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Compras } from 'src/app/entity/Compras';
import { Tipoproducto } from 'src/app/entity/Tipoproducto';
import { ComprasService } from 'src/app/services/compras.service';
import { TipoproductosService } from 'src/app/services/tipoproductos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  listaCompras: Compras[]=[]
  listaProductos: Tipoproducto[]=[];

  constructor(private comprasService: ComprasService,
    private tipoproductoService: TipoproductosService){}

  ngOnInit(): void {
    this.tipoproductoService.getAll('').subscribe({
      next: lista => {
        this.listaProductos=lista;
      },
      error: err=>{
        console.log("Error >> "+err);
        Swal.fire('Tipo Productos','No se logro recuperar la informacion', 'error');
      }
    });

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [5,10,20,50],
      ajax: (dataTablesParameters: any, callback) => {
        console.log("dataTablesParameters >> "+JSON.stringify(dataTablesParameters));
        this.comprasService.getAll(dataTablesParameters).subscribe(response => {
          let totalRecords = response.length;
          let filteredRecords = response.length;
          callback({
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data: response
          });
        });
      },
      columns: [
        {title:"Id", data: 'compraid'},
        {title:"Proveedor", data: 'proveedorid'},
        {title:"Nº articulos", data: 'compranumeroarticulos'},
        {title:"Importe Neto", data: 'compraimporteneto'},
        {title:"IVA", data: 'compraimporteiva'},
        {title:"Importe Total", data: 'compraimportetotal'},
        {title:"Fecha", data: 'comprafechacreacion'}
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
         // self.showDetalleEstudio(data);
        });
        return row;
      }
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.dtOptions);
    });
  }

  guardarCompra():void{
    console.log("Se guardara ");
  }

}
