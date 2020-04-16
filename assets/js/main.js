(function ($) {
  $.fn.tablePlugin = function () {
    let $div = $(this)
    $("body>div").append(`<div class="wraper-loading"><div class="loader"></div></div>`)
    $div.append(`<table class="table table-bordered table-striped custom-table"><thead><tr></tr></thead><tbody></tbody></table>`)
    $div.append(`<div class="wrap-pagination"></div>`)
    let $table = $('table tbody')
    let $thead = $("table thead tr")
    let current_page = 1

    const checkButtonClick = {
      create: [],
      remove: [],
      edit: []
    }

    let sortASCTable = {}

    let idRowSelect = -1
    let arrCheckBoxChecked = []

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
      $(".wraper-loading").css("display", "none");
      $table.empty();
      let keys = Object.keys(dataSource.data[0]);
      const offset = (current_page - 1) * dataSource.pagination.pageSize
      const limit = dataSource.pagination.pageSize + offset

      const dataFormat = dataSource.data.slice(offset, limit).map(function (item) {
        item.employee_salary = item.employee_salary.toString().trim().replace(/^0/, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        return item
      })

      $.each(dataFormat, function (index, item) {
        let tr = `<tr id=${item.id}>`
        tr += `<td><input class="form-check-input" type="checkbox" value="" id="${"check-row-" + item.id}"></input><label for=${"check-row-" + item.id}></label></td>`
        $.each(keys, function (indexHeader, key) {
          tr += `<td class="${key + ' ' + item.id}">${item[key]}</td>`;
        });
        tr += "</tr>"
        $table.append(tr)
      })
      const isCheckAll = $("table thead").find("th input[type=checkbox]").is(':checked');
      if (isCheckAll) {
        $("table tbody tr").addSelectCheckbox()
      } else {
        $("table tbody tr").removeSelectCheckbox()
      }
      $("table tbody").find("tr td input[type=checkbox]").prop("checked", isCheckAll);

      checkButtonClick["create"].map(function (item) {
        $("table tbody").find(`tr#${item.id}`).addClass("add-row")
        $("table tbody").find(`#check-row-${item.id}`).css("display", "none")
        $("table tbody").find(`label[for='check-row-${item.id}`).css("display", "none")
      })

      checkButtonClick["remove"].map(function (id) {
        $("table tbody").find(`tr#${id}`).addClass("pending-delete")
        $("table tbody").find(`tr#${id} td input[type=checkbox]`).prop("checked", true);
      })
      checkButtonClick["edit"].map(function (item) {
        $("table tbody").find(`tr#${item.id}`).addClass("pending-edit")
      })

      $(`table tbody tr#${idRowSelect}`).selectRow()

      arrCheckBoxChecked.map(function (id) {
        $("table tbody").find(`tr#${id}`).addSelectCheckbox()
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
    }

    resetForm = function () {
      $("#input-id").val("")
      $("#input-name").val("")
      $("#input-age").val("")
      $("#input-salary").val("")
    }

    validate = function () {
      let valName = $("#input-name").val().trim()
      const name_regex = /[0-9]|-|\+|=|_|\)|\(|\*|&|\^|%|\$|#|@|!|~|:|;|\}|]|{|\/|\?|\.|>|,|</g
      if (valName === "") {
        $(".valid-name").text("Employee name can't be empty.")
        $("#input-name").addClass('form-control-error')
        $("#input-name").focus()
        return false;
      } else if (valName.match(name_regex)) {
        $(".valid-name").text("Please enter the right format.")
        $("#input-name").addClass('form-control-error')
        $("#input-name").focus()
        return false;
      }
      else {
        $("#input-name").removeClass('form-control-error')
        $(".valid-name").text("")
      }

      let valSalary = $("#input-salary").val().replace(/,/g, '').replace(/[a-zA-Z]/g, '')
      if (valSalary === "") {
        $(".valid-salary").text("Employee salary can't be empty.")
        $("#input-salary").addClass('form-control-error')
        $("#input-salary").focus()
        return false;
      } else if (valSalary < 0) {
        $(".valid-salary").text("Employee salary must be 0 and above.")
        $("#input-salary").addClass('form-control-error')
        $("#input-salary").focus()
        return false;
      } else {
        $("#input-salary").removeClass('form-control-error')
        $(".valid-salary").text("");
      }

      let valAge = $("#input-age").val().replace(/e/g, '')
      if (valAge === "") {
        $(".valid-age").text("Employee age can't be empty.")
        $("#input-age").addClass('form-control-error')
        $("#input-age").focus()
        return false;
      } else if (valAge < 20) {
        $(".valid-age").text("Employee age must be 20 and above.")
        $("#input-age").addClass('form-control-error')
        $("#input-age").focus()
        return false;
      } else if (valAge > 65) {
        $(".valid-age").text("Employee age must be 65 and under.")
        $("#input-age").addClass('form-control-error')
        $("#input-age").focus()
        return false;
      } else {
        $("#input-age").removeClass('form-control-error')
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

    $('input').on('input', function () {
      setTimeout(function () {
        let id = $("#input-id").val()
        if (id) {
          const idsRecordAddRow = checkButtonClick["create"].map(function (item) {
            return item.id
          })
          if (idsRecordAddRow.includes(id)) {
            if (!!validate()) {
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
              checkButtonClick["create"] = checkButtonClick["create"].map(function (item) {
                if (item.id === id) {
                  return record
                } else {
                  return item
                }
              })
            }
          }
          else {
            if (!!validate()) {
              $(`table tbody tr#${id}`).addClass("pending-edit")
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
          }
        }
      }, 250)
    })

    bindDataForm = function (data) {
      let inputs = $(".form-group input.form-control")

      const idsRecordAddRow = checkButtonClick["create"].map(function (item) {
        return item.id
      })

      if (idsRecordAddRow.includes(data[1])) {
        $("#input-id").css("color", "#eee")
      } else {
        $("#input-id").css("color", "#000")
      }
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

    $.fn.addSelectCheckbox = function () {
      this.addClass("row-selected-all")
    }

    $.fn.removeSelectCheckbox = function () {
      this.removeClass("row-selected-all")
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
      if ($(".row-selected").length === 1) {
        const tr = $(".row-selected").closest("tr")
        let count = 0;
        let values = []
        $(tr).find("td").each(function () {
          values[count] = $(this).text();
          count++;
        });
        bindDataForm(values);
      }
    }

    // handle pagination
    handleChangePagination = function (curentPage) {
      current_page = curentPage
      $.fn.handleLoadingPagination()
    }

    handlePreviousPagination = function () {
      if (current_page === 1)
        return;
      current_page = current_page - 1
      $.fn.handleLoadingPagination()
    }

    handleNextPagination = function () {
      if (current_page >= Math.ceil(dataSource.data.length / dataSource.pagination.pageSize))
        return;
      current_page += 1
      $.fn.handleLoadingPagination()
    }

    handleFirstPagination = function () {
      current_page = 1
      $.fn.handleLoadingPagination()
    }

    handleLastPagination = function () {
      current_page = Math.ceil(dataSource.data.length / dataSource.pagination.pageSize)
      $.fn.handleLoadingPagination()
    }

    // Ref: https://www.yogihosting.com/jquery-pagination/
    $.fn.createPagination = function () {
      let totalPage = Math.ceil(dataSource.data.length / dataSource.pagination.pageSize)
      let span = ''
      span += `<span class="item-pagination ${current_page === 1 ? "disable" : ""}"" onClick="handleFirstPagination()">&#10092;&#10092;</span>`
      span += `<span class="item-pagination ${current_page === 1 ? "disable" : ""}" onClick="handlePreviousPagination()">&#10092;</span>`

      if (current_page - 3 > 1) {
        span += `<span class="item-pagination ${current_page === 1 ? "active" : ""}" onClick="handleChangePagination(${1})">${1}</span>`
        span += `<span class="item-more" style="display: ${current_page === 1 || totalPage < 6 ? "none" : "inline-block"}" onClick="handlePreviousPagination()">•••</span>`
      }

      for (let i = current_page - 3; i <= current_page; i++) {
        if (i >= 1) {
          span += `<span class="item-pagination ${current_page === i ? "active" : ""}" onClick="handleChangePagination(${i})">${i}</span>`
        }
      }

      for (let i = current_page + 1; i <= current_page + 3; i++) {
        if (i <= totalPage) {
          span += `<span class="item-pagination ${current_page === i ? "active" : ""}" onClick="handleChangePagination(${i})">${i}</span>`
        }
      }

      if (current_page + 3 < totalPage) {
        span += `<span class="item-more" style="display: ${current_page === totalPage || totalPage < 6 ? "none" : "inline-block"}" onClick="handleNextPagination()">•••</span>`
        span += `<span class="item-pagination ${current_page === totalPage ? "active" : ""}" onClick="handleChangePagination(${totalPage})">${totalPage}</span>`
      }

      span += `<span class="item-pagination ${current_page === totalPage ? "disable" : ""}" onClick="handleNextPagination()">&#10093;</span>`
      span += `<span class="item-pagination ${current_page === totalPage ? "disable" : ""}" onClick="handleLastPagination()">&#10093;&#10093;</span>`
      $(".wrap-pagination").append(span)
    }

    // handle event button click
    $("#btn-add").click(function () {
      if (!!validate()) {
        let employee_name = $("#input-name").val()
        let employee_age = $("#input-age").val()
        let employee_salary = $("#input-salary").val().replace(/[a-zA-Z]$/g, '')
        employee_name = formatEmployee(employee_name);

        const idEmployee = +dataSource.data[dataSource.data.length - 1].id + 1

        let tr = `<tr id="${idEmployee}" class="add-row">`
        tr += `<td></td>`
        tr += `<td id="id ${idEmployee}">${idEmployee}</td>
              <td class="employee_name ${idEmployee}">${employee_name}</td>
              <td class="employee_salary ${idEmployee}">${employee_salary}</td>
              <td class="employee_age ${idEmployee}">${employee_age}</td>`
        tr += "</tr>"
        $table.prepend(tr)
        const data = {
          id: idEmployee.toString(),
          employee_name,
          employee_salary: employee_salary.replace(/,/g, ''),
          employee_age
        }
        checkButtonClick["create"].push(data)
        dataSource.data = [data, ...dataSource.data]
        resetForm()
        bindData()
      }
    })

    $("#btn-delete").click(function (e) {
      const tds = $("table tbody tr").find("input[type=checkbox]:checked")
      tds.parent().parent().addClass('pending-delete')

      checkButtonClick["remove"] = []

      const ids = arrCheckBoxChecked.filter(function (item, index) {
        if (arrCheckBoxChecked.indexOf(item) === index) {
          return item
        }
      })

      if (ids.includes(idRowSelect)) {
        resetForm()
      }
      checkButtonClick["edit"] = checkButtonClick["edit"].filter(function (item) {
        if (!ids.includes(item.id)) {
          return item
        }
      });

      checkButtonClick["remove"] = ids
    })

    handleSaveApi = function (type, fn) {
      $.fn.sendMultliple(checkButtonClick[type], fn)
        .then(function () {
          alert(`${type.charAt(0).toUpperCase() + type.slice(1)} successfully.`)
        })
        .catch(function (err) {
          alert("An error occurred, please try again.")
        })
        .finally(function () {
          checkButtonClick[type] = []
          $.fn.removeTable()
          loadData()
        })
    }

    $("#btn-save").click(function () {
      if (checkButtonClick["remove"].length > 0 || checkButtonClick["create"].length > 0 || checkButtonClick["edit"].length > 0) {
        $(".wraper-loading").css("display", "block");
        clickRow = []
        loadData()
        if (checkButtonClick["remove"].length > 0) {
          handleSaveApi("remove", $.fn.removeRecord)
        }
        if (checkButtonClick["create"].length > 0) {
          checkButtonClick["create"].map(function (item) {
            delete item.id
            return item
          })
          handleSaveApi("create", $.fn.create)
        }
        if (checkButtonClick["edit"].length > 0) {
          handleSaveApi("edit", $.fn.edit)
        }
      }
    })

    // Handle event table click
    $("table tbody").on("click", "tr", function (e) {

      // Check all checkbox are checked or not
      if (dataSource.data.length === $("table tbody tr").find("input[type=checkbox]:checked").length) {
        $("table thead").find("tr th input[type=checkbox]").prop("checked", true);
        $.each($("table tbody tr"), function () {
          $(this).addSelectCheckbox()
        })
      } else {
        $("table thead").find("tr th input[type=checkbox]").prop("checked", false);
        $.each($("table tbody tr"), function () {
          $(this).removeSelectCheckbox()
        })
      }

      let values = []
      let count = 0;
      $(this).find("td").each(function () {
        values[count] = $(this).text();
        count++;
      });

      $.each($("table tbody tr"), function (item) {
        if ($(this).attr('id') !== values[1]) {
          $(this).removeSelectRow()
        }
      })

      $(this).toggleClass("row-selected")

      const tds = $("table tbody tr").find("input[type=checkbox]:checked")
      tds.parent().parent().addSelectCheckbox()
      $.each(tds, function (index, item) {
        arrCheckBoxChecked.push($(item).closest("tr").attr('id'))
      })

      idRowSelect = $(".row-selected").attr('id')
      if ($(".row-selected").length === 0) {
        resetForm()
      } else {

        bindDataForm(values)
      }

    });

    $("table thead").on("click", "tr", function () {
      const isCheckAll = $(this).find("th input[type=checkbox]").is(':checked');
      if (isCheckAll) {
        $("table tbody tr").addSelectCheckbox()
      } else {
        arrCheckBoxChecked = []
        $("table tbody tr").removeSelectCheckbox()
      }
      $("table tbody").find("tr td input[type=checkbox]").prop("checked", isCheckAll);

      checkButtonClick["create"].map(function (item) {
        $("table tbody").find(`tr#${item.id}`).addClass("add-row")
      })

      checkButtonClick["edit"].map(function (item) {
        $("table tbody").find(`tr#${item.id}`).addClass("pending-edit")
      })
      checkButtonClick["remove"].map(function (id) {
        $("table tbody").find(`tr#${id}`).addClass("pending-delete")
        $("table tbody").find(`tr#${id} td input[type=checkbox]`).prop("checked", true);
      })
    })

    // resizable
    let pressed = false;
    let start = undefined;
    let startX, startWidth;

    $("table thead").on('mousedown', 'th.resizable', function (e) {
      start = $(this);
      pressed = true;
      startX = e.pageX;
      startWidth = $(this).width()
      $(start).addClass("resizing");
      $(start).addClass("noSelect");
    });

    $(document).mousemove(function (e) {
      if (pressed) {
        $(start).width(startWidth + (e.pageX - startX));
      }
    });

    $(document).mouseup(function () {
      if (pressed) {
        $(start).removeClass("nSelect");
        pressed = false;
      }
    });

  }
}(jQuery));
