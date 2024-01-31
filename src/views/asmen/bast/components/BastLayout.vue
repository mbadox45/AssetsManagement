<script setup>
    import { onMounted } from 'vue';
    // import pdfMake from 'pdfmake/build/pdfmake';
    // import pdfFonts from 'pdfmake/build/vfs_fonts';
    // import htmlToPdfmake from 'html-to-pdfmake';

    import html2canvas from 'html2canvas';
    import jsPDF from 'jspdf';

    // import logo from "/Project/Javascript/Vue/FIX Project/AssetsManagement/public/survey.png";

    const f_xs = 7;
    const f_sm = 8;
    const f_md = 13;
    const f_p_md = 10;
    const f_lg = 15;
    const f_xl = 18;
    const left = 50;
    const right = 50;
    const left1 = 80;
    const right1 = 80;

    // const loadFont = () => {
    //     const font = new FontFace('Times', 'url(times.ttf)');

    //     font.load().then(() => {
    //         document.fonts.add(font);

    //         pdfMake.fonts = {
    //             Times: {
    //                 normal: 'Times',
    //             },
    //         };

    //         printDocument();
    //     });
    // };

    const printDocument = () => {
    //     //get table html
    //     const pdfTable = document.getElementById('divToPrint');
    //     //html to pdf format
    //     // var html = htmlToPdfmake(pdfTable.innerHTML);

    //     // const documentDefinition = { content: html };

    //     pdfMake.vfs = pdfFonts.pdfMake.vfs;

    //     const documentDefinition = {
    //         content: [
    //             // Headers Table
    //             {
    //                 style: 'headersTable',
    //                 table: {
    //                     widths: [80, '*',75,50],
    //                     body: [
    //                         [
    //                             {
    //                                 // image:logo,
    //                                 text:'public/survey.png',
    //                                 rowSpan:4
    //                             }, 
    //                         {text:[{text:'PT. INDUSTRI NABATI LESTARI\n', style:'header_lg'},{text:'\nPABRIK MINYAK GORENG\n\n', style:'header_xs'},{text:'Kantor Pusat', style:'header_xs2', bold:true},{text:' : Komp.KEK Sei Mangkei, Kav.2-3, Kec. Bosar Maligas, Kab\n', style:'header_xs2'},{text:'Simalungun, Sumatera Utara, 21184', style:'header_xs2'}], rowSpan:2, margin: [0,3,0,3]}, {text:'No. Dokumen', style:'header_sm'}, {text:'Tgl. Berlaku', style:'header_sm'}],
    //                         ['','Column 2', {text:'INLHO/REP-F/045', style:'header_sm2'}, {text:'12 Nov 2018', style:'header_sm2'}],
    //                         ['',{text:'BA SERAH TERIMA', style:'header_md', rowSpan:2}, {text:'No. Revisi', bold: true, style:'header_sm'}, {text:'Halaman', style:'header_sm'}],
    //                         ['','Column 2', {text:'00', style:'header_sm3'}, {text:'1 dari 1', style:'header_sm3'}],
    //                     ]
    //                 }
    //             },
    //             {
    //                 style: 'headersPage',
    //                 text:'BERITA ACARA SERAH TERIMA'
    //             },
    //             {
    //                 style: 'paragraphPage',
    //                 text:'Pada hari ini Rabu Tanggal 28 Desember 2022 Telah diserah terimakan barang 1 unit laptop dengan spesifikasi sebagai berikut :'
    //             },
    //             // Table Detail Assets
    //             {
    //                 style: 'spekTable',
    //                 alignment:'left',
    //                 table: {
    //                     widths: [120, '*'],
    //                     body: [
    //                         [{text:'No. Asset Tag', style:'assignFonts'},''],
    //                         [{text:'Jenis Perangkat', style:'assignFonts'},''],
    //                         [{text:'Merk/Type', style:'assignFonts'},''],
    //                         [{text:'Kondisi', style:'assignFonts'},''],
    //                         [{text:'SPESIFIKASI', style:'assignFonts', colSpan:2, bold:true, alignment:'center'},''],
    //                         // Sisanya Daftar Spek
    //                     ]
    //                 }
    //             },
    //             {
    //                 style: 'paragraphPage',
    //                 text:'Demikianlah berita acara ini dibuat dengan sebenarnya.'
    //             },
    //             {
    //                 style: 'assignTable',
    //                 table: {
    //                     widths: ['*', '*'],
    //                     body: [
    //                         [{text:'Pembuat Berita Acara', colSpan:2, style:'assignFonts'},''],
    //                         [{text:'Diterima Oleh :', style:'assignFonts'},{text:'Diserahkan Oleh:', style:'assignFonts'}],
    //                         [
    //                             {
    //                                 style:'assignFonts', 
    //                                 alignment:'left',
    //                                 table: {
    //                                     widths: [80,'*'],
    //                                     body: [
    //                                         [{text:'[Jabatan]', colSpan:2, style:'assignFonts', alignment:'center', bold:true}, ''],
    //                                         ['Nama', ':'],
    //                                         ['Tanggal', ':'],
    //                                         ['Status', ':'],
    //                                     ]
    //                                 },
    //                                 layout: 'noBorders'
    //                             },
    //                             {
    //                                 style:'assignFonts', 
    //                                 alignment:'left',
    //                                 table: {
    //                                     widths: [80,'*'],
    //                                     body: [
    //                                         [{text:'[Jabatan]', colSpan:2, style:'assignFonts', alignment:'center', bold:true}, ''],
    //                                         ['Nama', ':'],
    //                                         ['Tanggal', ':'],
    //                                         ['Status', ':'],
    //                                     ]
    //                                 },
    //                                 layout: 'noBorders'
    //                             }
    //                         ],
    //                         [{text:'Diketahui Oleh :', colSpan:2, style:'assignFonts'},''],
    //                         [
    //                             {
    //                                 style:'assignFonts', 
    //                                 alignment:'left',
    //                                 colSpan:2,
    //                                 table: {
    //                                     widths: [80,'*'],
    //                                     body: [
    //                                         [{text:'Officer ICT', colSpan:2, style:'assignFonts', alignment:'center', bold:true}, ''],
    //                                         ['Nama', ': Diah Fika Satrya'],
    //                                         ['Tanggal', `:`],
    //                                         ['Status', `:`],
    //                                     ]
    //                                 },
    //                                 layout: 'noBorders'
    //                             },
    //                             '',
    //                         ],
    //                     ]
    //                 }
    //             },
    //         ],
    //         styles: {
    //             headersTable: {
    //                 margin: [10, 0, 10, 0],
    //                 alignment:'center',
    //             },
    //             assignTable: {
    //                 margin: [left, 0, right, 0],
    //                 alignment:'center',
    //             },
    //             spekTable: {
    //                 margin: [left1, 0, right1, 0],
    //                 alignment:'center',
    //             },
    //             assignFonts: {
    //                 fontSize:f_p_md,
    //             },
    //             headersPage: {
    //                 bold:true,
    //                 fontSize:f_xl,
    //                 margin: [left, 20, right, 10],
    //                 decoration:'underline',
    //                 alignment:'center',
    //             },
    //             paragraphPage: {
    //                 fontSize:f_p_md,
    //                 margin: [left, 20, right, 10],
    //                 alignment:'justify',
    //             },
    //             header_xs:{
    //                 fontSize:f_xs,
    //                 characterSpacing:1,
    //                 alignment: 'center',
    //             },
    //             header_xs2:{
    //                 fontSize:f_xs,
    //                 alignment: 'center',
    //             },
    //             header_sm:{
    //                 bold: true, 
    //                 fontSize:f_sm,
    //                 alignment: 'center',
    //             },
    //             header_sm2:{
    //                 fontSize:f_sm,
    //                 margin: [0,17,0,0],
    //                 alignment: 'center',
    //             },
    //             header_sm3:{
    //                 fontSize:f_sm,
    //                 alignment: 'center',
    //             },
    //             header_lg:{
    //                 bold: true, 
    //                 fontSize:f_lg,
    //                 decoration:'underline',
    //                 alignment: 'center',
    //             },
    //             header_md:{
    //                 bold: true, 
    //                 fontSize:f_md,
    //                 margin: [0,5,0,0],
    //                 alignment: 'center',
    //             }
    //         },
    //         pageSize: 'A4',
    //         pageMargins: [ 25, 25, 25, 25 ],
    //         pageOrientation: 'portrait',
    //     }
    //     pdfMake.createPdf(documentDefinition).open();
    }

    // const printDocument = () => {
    //     //get table html
    //     // window.html2canvas = html2canvas;
    //     // var doc = new jsPDF();
    //     // doc.html(document.querySelector('#divToPrint'), {
    //     //     callback: function(pdf){
    //     //         pdf.save("Save.pdf")
    //     //     },
    //     //     width: 206,
    //     //     windowWidth: 675,
    //     // })

    //     var doc = new jsPDF();

    //     // Source HTMLElement or a string containing HTML.
    //     var elementHTML = document.querySelector("#divToPrint");

    //     doc.html(elementHTML, {
    //         callback: function(doc) {
    //             // Save the PDF
    //             // doc.save('document-html.pdf');
    //             var blob = doc.output("blob");
    //             window.open(URL.createObjectURL(blob));
    //         },
    //         // margin: [2, 2, 2, 2],
    //         autoPaging: 'text',
    //         x: 0,
    //         y: 0,
    //         width: 206,
    //         windowWidth: 675
    //     });
    // }

    // onMounted(() => {
    //     printDocument();
    // });

</script>

<style>
.border{
    border: 1px solid;
}
</style>

<template>
    <div>
        <div id="divToPrint">
            <h3>Kantor Pusat: Komp. KEKSei Mangkei , Kav.2-3, Kec. Bosar Maligas, Kab. Simalungun, Sumatera Utara, 21184 </h3>
        </div>
        <Button label="Test PDF" @click="printDocument"></Button>
    </div>
</template>