import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Inventario } from 'src/app/entity/Inventario';
import { InventarioService } from 'src/app/services/inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements AfterViewInit, OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  listaInventario: Inventario[]=[];

  constructor(private inventarioService: InventarioService){}

  ngOnInit(): void {
    this.inventarioService.getAll('').subscribe({
      next: lista => {
        this.listaInventario=lista;
        this.rerender();
      },
      error: err=>{
        console.log("Error >> "+err);
        Swal.fire('Inventario','No se logro recuperar la informacion', 'error');
      }
    });

    this.dtOptions = {
      pagingType: "full_numbers",
      lengthMenu: [5,10,20,50],
      ajax: (dataTablesParameters: any, callback) => {
        console.log("dataTablesParameters >> "+JSON.stringify(dataTablesParameters));
        this.inventarioService.getAll(dataTablesParameters).subscribe(response => {
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
        {title:"Id", data: 'inventarioid'},
        {title:"Compra", data: 'compraid'},
        {title:"Nombre", data: 'tipoproductoid'},
        {title:"Unidad", data: 'inventariounidad'},
        {title:"Cantidad", data: 'inventariocantidadoriginal'},
        {title:"Restante", data: 'inventariocantidadactual'},
        {title:"Caducidad", data: 'inventariofechacaducidad'},
        {title:"Fecha", data: 'inventariofechacreacion'}
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
