/**
 * @author Jorge Ulises Useche Cuellar
 */

var editor = ace.edit("editor");
editor.setTheme("ace/theme/eclipse");
editor.getSession().setMode("ace/mode/php");

$.ajax({
  url: "code/form.php.txt",
  beforeSend: function( xhr ) {
    xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
  }
})
.done(function( data ) {
  //console.log(data);
  editor.insert(data);
});

$("ol.nested_with_drop").sortable({
	group : 'nested',
	handle : 'i.icon-move',
	onDragStart : function(item, container, _super) {
		// console.log(container,_super);
		// Duplicate items of the no drop area
		// console.log(item);
		if (!container.options.drop) {
			var itemclone = item.clone();
			itemclone.find('.icon-config')[0].valores = item.find('.icon-config')[0].valores;
			addClickEvent(itemclone.find('.icon-config')[0]);
			itemclone.insertAfter(item);
			//alert();
		}
		_super(item);
	}
});

$("ol.nested_with_no_drop").sortable({
	group : 'nested',
	drop : false
});

// $(".icon-config").click(function(){
	// //alert();
// 	
// });

function crearAtributos (elem,value){
	$.getJSON("elements/"+value+".json", function(result){
	    $(elem)[0].valores=result;
	    addClickEvent(elem);
	});	
}

function addClickEvent(elem){
	$(elem).click(function(){
    	openDialog(elem);
    });
}

/**
 * a partir de un tipo de elemento con valores, retorna el nodo con la estructura definida
 * @param {Object} elem
 */
function createConfigNode(elem){
	var arreglo = $(elem)[0].valores;
	
	var table1 = $("<table>").addClass("table-striped table1").css("width","100%");
	var thead = $("<thead>").html("<tr>"+
	    "<th>Atributo</th>"+
	    "<th>Valor</th>"+
	    "</tr>");
	var tbody = $("<tbody>");
	$.each(arreglo.$atributos,function(key,value){
		var td = crearTdKeyValue(key,value);
		var tr = $("<tr>");
		tr.append(td[0]);
		tr.append(td[1]);
		tbody.append(tr);
	});
	table1.append(thead);
	table1.append(tbody);
	
	var table2 = $("<table>").addClass("table-striped table2").css("width","100%");
	var thead = $("<thead>").html("<tr>"+
	    "<th>Atributo</th>"+
	    "<th>Valor</th>"+
	    "</tr>");
	var tbody = $("<tbody>");
	var attr = "$esteCampo";
	var tr = $("<tr>").append(crearTdKeyValue(attr,arreglo[attr]));
	tbody.append(tr);
	var attr = "header";
	var tr = $("<tr>").append(crearTdTextAreaKeyValue(attr,arreglo[attr]));
	tbody.append(tr);
	var attr = "footer";
	var tr = $("<tr>").append(crearTdTextAreaKeyValue(attr,arreglo[attr]));
	tbody.append(tr);
	table2.append(thead);
	table2.append(tbody);
	
	var div = $('<div>').append(table1).append(table2);
	return div;
}

function crearTdKeyValue(key,value){
	var td1 = $("<td>").html(key);
	var input = $("<input>").addClass("form-control").attr("key",key).attr("value",value);
	var td2 = $("<td>").append(input);
	return [td1,td2];
}

function crearTdTextAreaKeyValue(key,arreglo){
	var valor = new String();
	$.each(arreglo,function(i,v){
		valor += v + "\n";
	});
	var td1 = $("<td>").html(key);
	var input = $("<textarea>")
		.addClass("form-control")
		.attr("key",key)
		.attr("rows",arreglo.length)
		.html(valor);
	var td2 = $("<td>").append(input);
	return [td1,td2];
}

function saveDataInNode(){
	$("#myModal .modal-body table").each(function(){
		console.log($(this).attr('key'),$(this).attr('value'));
	});
}

function openDialog(elem){
	var tabla = createConfigNode(elem);
	$("#myModal .modal-body").empty();
	$("#myModal .modal-body").append(tabla);
	$('#myModal').modal('show');
}

$(".nested_with_no_drop .icon-config").each(function( index ) {
  crearAtributos(this,$(this).attr('value'));
});
