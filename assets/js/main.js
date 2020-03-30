let current_page = 1
let TOTAL_PAGE = 0
$(document).ready(function () {
  let $div = $('.table-jquery')
  $div.append(`<table class="table table-bordered table-striped custom-table"><thead><tr></tr></thead><tbody></tbody></table>`)
  $div.append(`<div class="wrap-pagination"></div>`)
  let $table = $('table tbody')
  let $thead = $("table thead tr")

  const checkButtonClick = {
    create: [],
    remove: [],
    edit: []
  }

  let sortASCTable = {}

  let clickRow = []

  $.fn.handleLoadingPagination = function () {
    $(".wrap-pagination").empty()
    $.fn.createTable()
    $.fn.createPagination()
  }

  handleSort = function ({ id, type }) {

    if (dataSource.data[0][id].replace(/,/g, '').match(/^\d+$/)) {
      if (type === "DESC") {
        dataSource.data.sort(function (a, b) {
          return b[id].replace(/,/g, '') - a[id].replace(/,/g, '')
        })
      } else {
        dataSource.data.sort(function (a, b) {
          return a[id].replace(/,/g, '') - b[id].replace(/,/g, '')
        })
      }
    } else {
      if (type === "DESC") {
        dataSource.data.sort(function (a, b) {
          let nameA = a[id].toLowerCase(),
            nameB = b[id].toLowerCase();
          return nameB.localeCompare(nameA);
        })
      } else {
        dataSource.data.sort(function (a, b) {
          let nameA = a[id].toLowerCase(),
            nameB = b[id].toLowerCase()
          return nameA.localeCompare(nameB);
        })
      }
    }
    $.fn.handleLoadingPagination()
  }

  handleSortClickHeader = function ({ id }) {
    if (!!sortASCTable["id"]) {
      sortASCTable.id = false;
      handleSort({ id, type: "DESC" })
      $(`.icon-sort__asc-${id}`).css("opacity", .3)
      $(`.icon-sort__desc-${id}`).css("opacity", 1)
    } else {
      sortASCTable.id = true;
      handleSort({ id, type: "ASC" })
      $(`.icon-sort__asc-${id}`).css("opacity", 1)
      $(`.icon-sort__desc-${id}`).css("opacity", .3)
    }
  }

  $.fn.createHeader = function () {
    $thead.append(`<th scope="col"><input class="form-check-input" type="checkbox" value="" id="check-all"></input><label for="check-all"></label></th>`)
    if (!!dataSource["columns"]) {
      $.each(dataSource["columns"], function (index, column) {
        const pattern = /\d$/g
        const widthHeader = !!column["width"] ? (pattern.test(column["width"]) ? column["width"].concat("%") : column["width"]) : "auto"
        $thead.append(`
                  <th scope="col" class="${column['isResizable'] ? "resizable" : ""}" style=width:${widthHeader} onClick=${column['isSort'] ? `"handleSortClickHeader({id: '${column.id}'})"` : ''}><span>${column["label"]}</span>
                   ${column["isSort"] ? ` <span class="wrap-icon-sort">
                  <img src="assets/image/sort-up.png" class="icon-sort icon-sort__asc-${column.id}" onClick="handleSort({id: '${column.id}', type: 'ASC'})">
                  <img src="assets/image/sort-down.png" class="icon-sort icon-sort__desc-${column.id}" onClick="handleSort({id: '${column.id}', type: 'DESC'})">
                  </span>` : ''}
                  </th>$`)
      })
    }
  }

  $.fn.createTable = function () {
    if (!!dataSource.data[0]["profile_image"]) {
      delete dataSource.data[0]["profile_image"]
    }
    $(".loader").css("display", "none");
    $(".custom-row").css("display", "flex");
    $table.empty();
    let keys = Object.keys(dataSource.data[0]);
    const offset = (current_page - 1) * dataSource.pagination.pageSize
    const limit = dataSource.pagination.pageSize + offset

    const dataFormat = dataSource.data.slice(offset, limit).map(function (item) {
      item.employee_salary = item.employee_salary.trim().replace(/^0/, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      return item
    })

    $.each(dataFormat, function (index, item) {
      let tr = `<tr id=${item.id === "N/A" ? "" : item.id} ${item.id === "N/A" ? "add-row" : ""}>`
      tr += `<td><input class="form-check-input" type="checkbox" value="" id="${"check-row-" + item.id}"></input><label for=${"check-row-" + item.id}></label></td>`
      $.each(keys, function (indexHeader, key) {
        tr += `<td class="${key + ' ' + item.id}">${item[key]}</td>`;
      });
      tr += "</tr>"
      $table.append(tr)
    })
    const isCheckAll = $("table thead").find("th input[type=checkbox]").is(':checked');
    if (isCheckAll) {
      $("table tbody tr").selectRow()
    } else {
      $("table tbody tr").removeSelectRow()
    }
    $("table tbody").find("tr td input[type=checkbox]").prop("checked", isCheckAll);

    checkButtonClick["edit"].map(function (item) {
      $("table tbody").find(`tr#${item.id}`).selectRow()
      $("table tbody").find(`tr#${item.id} td input[type=checkbox]`).prop("checked", true);
    })
    checkButtonClick["remove"].map(function (id) {
      $("table tbody").find(`tr#${id}`).addClass("pending-action")
      $("table tbody").find(`tr#${id} td input[type=checkbox]`).prop("checked", true);
    })
   clickRow.map(function (id) {
      $("table tbody").find(`tr#${id}`).selectRow()
      $("table tbody").find(`tr#${id} td input[type=checkbox]`).prop("checked", true);
    })
  }

  $.fn.removeTable = function () {
    $('table tbody').empty();
    $('table thead tr').empty();
    $(".wrap-pagination").empty();
    $(".valid-age").text("")
    $(".valid-name").text("")
    $(".valid-salary").text("")
    $(".loader").css("display", "block");
    $(".custom-row").css("display", "none");
  }

  resetForm = function () {
    $("#input-id").val("")
    $("#input-name").val("")
    $("#input-age").val("")
    $("#input-salary").val("")
  }

  validate = function () {
    let valName = $("#input-name").val().trim()
    const name_regex = /^([a-zA-Z'-,.\s]{1,100})$/g

    if (valName === "") {
      $(".valid-name").text("Employee name can't be empty.")
      $("#input-name").focus()
      return false;
    } else if (!valName.match(name_regex)) {
      $(".valid-name").text("Please enter the right format.")
      $("#input-name").focus()
      return false;
    }
    else {
      $(".valid-name").text("")
    }

    let valSalary = $("#input-salary").val().replace(/,/g, '').replace(/[a-zA-Z]/g, '')
    if (valSalary === "") {
      $(".valid-salary").text("Employee salary can't be empty.")
      $("#input-salary").focus()
      return false;
    } else if (valSalary < 0) {
      $(".valid-salary").text("Employee salary must be 0 and above.")
      $("#input-salary").focus()
      return false;
    } else {
      $(".valid-salary").text("");
    }

    let valAge = $("#input-age").val().replace(/e/g, '')
    if (valAge === "") {
      $(".valid-age").text("Employee age can't be empty.")
      $("#input-age").focus()
      return false;
    } else if (valAge < 20) {
      $(".valid-age").text("Employee age must be 20 and above.")
      $("#input-age").focus()
      return false;
    } else if (valAge > 65) {
      $(".valid-age").text("Employee age must be 60 and under.")
      $("#input-age").focus()
      return false;
    } else {
      $(".valid-age").text("");
    }

    return true
  }

  $('#input-salary').keydown(function (e) {
    const pattern = /^[0-9]*$/g
    if (pattern.test(e.target.value.replace(/,/g, ''))) {
      return true
    }
    else {
      e.target.value = e.target.value.slice(0, e.target.value.length - 1)
      return false
    }
  });

  $('#input-age').keypress(function (e) {
    // 0 for null values
    // 8 for backspace 
    // 48-57 for 0-9 numbers
    if (e.which != 8 && e.which != 0 && e.which < 48 || e.which > 57) {
      e.preventDefault();
    }
  });

  //Format salary
  $("#input-salary").on('input', function () {
    $(this).val($(this).val().replace(/,/g, '').trim().replace(/^0/, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
  })

  bindDataForm = function (data) {
    let inputs = $(".form-group input.form-control")
    $.each(inputs, function (index, input) {
      input.value = data[index + 1]
    })
  }

  loadData = function () {
    if (checkButtonClick["create"].length === 0 && checkButtonClick["remove"].length === 0 && checkButtonClick["edit"].length === 0) {
      $.fn.get()
      return;
    }
  }

  // fetch data
  $.fn.get();

  $.fn.selectRow = function () {
    this.addClass("row-selected")
  }

  $.fn.removeSelectRow = function () {
    this.removeClass("row-selected")
  }

  $.fn.sendMultliple = function (data, func) {
    const promies = $.map(data, function (item) {
      return func(item)
    })
    return Promise.all(promies)
  }

  formatEmployee = function (text) {
    let name = text.trim().replace(/(\s+)/, ' ');
    name = name.split(' ').map(function (item) {
      return item.slice(0, 1).toUpperCase() + item.slice(1, item.length).toLowerCase()
    }).join(" ")

    return name
  }

  // when the table has a click row
  bindData = function () {
    if ($("table tbody tr").find("input[type=checkbox]:checked").length === 1) {
      const tr = $("table tbody tr input[type=checkbox]:checked").closest("tr")
      let count = 0;
      let values = []
      $(tr).find("td").each(function () {
        values[count] = $(this).text();
        count++;
      });
      bindDataForm(values);
    }
  }

  // handle event button click
  $("#btn-add").click(function () {
    if (!!validate()) {
      let employee_name = $("#input-name").val()
      let employee_age = $("#input-age").val()
      let employee_salary = $("#input-salary").val().replace(/[a-zA-Z]$/g, '')
      employee_name = formatEmployee(employee_name);

      let tr = "<tr id='add-row'>"
      tr += `<td><input class="form-check-input" type="checkbox" value=""><label></label></input></td>`
      tr += "<td>N/A</td><td>" + employee_name + "</td><td>" + employee_salary + "</td><td>" + employee_age + "</td>";
      tr += "</tr>"
      $table.prepend(tr)
      const data = {
        id: "N/A",
        employee_name,
        employee_salary: employee_salary.replace(/,/g, ''),
        employee_age
      }
      checkButtonClick["create"].push(data)
      if (current_page === 1) {
        dataSource.data = [data, ...dataSource.data]
      }
      resetForm()
      bindData()
    }
  })

  $("#btn-edit").click(function (e) {
    if (!!validate()) {
      let id = $("#input-id").val()
      let employee_name = $("#input-name").val()
      let employee_age = $("#input-age").val()
      let employee_salary = $("#input-salary").val()
      employee_name = formatEmployee(employee_name);

      $(`.employee_name.${id}`).text(employee_name)
      $(`.employee_age.${id}`).text(employee_age)
      $(`.employee_salary.${id}`).text(employee_salary.replace(/[a-zA-Z]$/g, ''))

      const record = { id, employee_name, employee_salary: employee_salary.replace(/,/g, '').replace(/[a-zA-Z]$/g, ''), employee_age }
      dataSource.data = dataSource.data.map(function (item) {
        if (item.id === id) {
          return record
        }
        else {
          return item
        }
      })
      if (checkButtonClick["edit"].length === 0) {
        checkButtonClick["edit"].push(record)
      }
      let checkRecord = false

      checkButtonClick["edit"] = checkButtonClick["edit"].map(function (item) {
        if (item.id === id) {
          checkRecord = true
          return record
        } else {
          return item
        }
      })
      if (!checkRecord) {
        checkButtonClick["edit"].push(record)
      }
    }
  })

  $("#btn-delete").click(function () {
    resetForm()
    const tds = $("table tbody tr").find("input[type=checkbox]:checked")
    tds.parent().parent().addClass('pending-action')
    let ids = []

    $.each(tds, function () {
      ids.push($(this).closest('tr').attr('id'));
    })

    checkButtonClick["edit"] = checkButtonClick["edit"].filter(function (item) {
      if (!ids.includes(item.id)) {
        return item
      }
    });

    dataSource.data.map(function (item) {
      if (ids.includes(item.id)) {
        checkButtonClick["remove"].push(item.id);
      }
    });
  })

  handleSaveApi = function (type, fn) {
    $.fn.sendMultliple(checkButtonClick[type], fn)
      .then(function () {
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} successfully.`)
      })
      .catch(function () {
        alert("An error occurred, please try again.")
      })
      .finally(function () {
        checkButtonClick[type] = []
        loadData()
      })
  }

  $("#btn-save").click(function () {
    $.fn.removeTable()
    clickRow = []
    loadData()
    if (checkButtonClick["remove"].length > 0) {
      handleSaveApi("remove", $.fn.removeRecord)
    }

    if (checkButtonClick["create"].length > 0) {
      handleSaveApi("create", $.fn.create)
    }

    if (checkButtonClick["edit"].length > 0) {
      handleSaveApi("edit", $.fn.edit)
    }
  })

  // Handle event table click
  $("table tbody").on("click", "tr", function (e) {
    let values = []
    let count = 0;
    $(this).toggleClass("row-selected")
    $(this).find("td").each(function () {
      values[count] = $(this).text();
      count++;
    });

    let $tgt = $(e.target);
    let isNotCheck = false;
    $("table thead").find("tr th input[type=checkbox]").prop("checked", false);

    // Check a checkbox is checked or not
    if (!$tgt.is('label') || !$tgt.is(':checkbox')) {
      isNotCheck = $(this).find("td input[type=checkbox]").is(":checked");
      $(this).find("td input[type=checkbox]").prop("checked", !isNotCheck);
    }
    if ($tgt.is('label')) {
      $(this).toggleClass("row-selected")
    }

    // Check all checkbox are checked or not
    if ($("table tbody tr").find("input[type=checkbox]").length === $("table tbody tr").find("input[type=checkbox]:checked").length) {
      $("table thead").find("tr th input[type=checkbox]").prop("checked", true);
    }

    const trChecked = $("table tbody tr").find("input[type=checkbox]:checked")
    $.each(trChecked, function (index, item) {
      const id = $(item.closest("tr")).attr('id')
      if(!clickRow.includes(id)) {
        clickRow.push(id)
      }
    })

    checkButtonClick["edit"].map(function (item) {
      $("table tbody").find(`tr#${item.id}`).selectRow()
      $("table tbody").find(`tr#${item.id} td input[type=checkbox]`).prop("checked", true);
    })
    checkButtonClick["remove"].map(function (id) {
      $("table tbody").find(`tr#${id}`).addClass("pending-action")
      $("table tbody").find(`tr#${id} td input[type=checkbox]`).prop("checked", true);
    })
    if (isNotCheck) {
      resetForm()
    } else {
      bindDataForm(values);
    }
    bindData()

  });

  $("table thead").on("click", "tr", function () {
    const isCheckAll = $(this).find("th input[type=checkbox]").is(':checked');
    if (isCheckAll) {
      $("table tbody tr").selectRow()
    } else {
      $("table tbody tr").removeSelectRow()
    }
    $("table tbody").find("tr td input[type=checkbox]").prop("checked", isCheckAll);
    checkButtonClick["edit"].map(function (item) {
      $("table tbody").find(`tr#${item.id}`).selectRow()
      $("table tbody").find(`tr#${item.id} td input[type=checkbox]`).prop("checked", true);
    })
    checkButtonClick["remove"].map(function (id) {
      $("table tbody").find(`tr#${id}`).addClass("pending-action")
      $("table tbody").find(`tr#${id} td input[type=checkbox]`).prop("checked", true);
    })
  })

})
