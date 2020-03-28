$(document).ready(function() {

    $.fn.get = function() {
        $.ajax({
            url: dataSource.api,
            method: "GET"
        }).done(function(data) {
            dataSource.data = data
            current_page = 1
            $.fn.removeTable()
            $.fn.createHeader(data)
            $.fn.createTable()
            $.fn.createPagination()
        }).fail(function(err) {
            alert("An error occurred, please try again.")
        })
    }
    $.fn.create = function(data) {
        return $.ajax({
            url: dataSource.api,
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
        })
    }

    $.fn.edit = function(data) {
        const { id } = data
        delete data.id
        return $.ajax({
            url: `${dataSource.api}/${id}`,
            type: "PUT",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
        })
    }

    $.fn.removeRecord = function(id) {
        return $.ajax({
            url: `${dataSource.api}/${id}`,
            type: "DELETE",
            dataType: "json",
            contentType: "application/json",
        })
    }
})