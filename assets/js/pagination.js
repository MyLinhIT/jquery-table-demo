$(document).ready(function () {
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
            span += `<span class="item-more" style="display: ${current_page === 1 ? "none" : "inline-block"}" onClick="handlePreviousPagination()">•••</span>`
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
            span += `<span class="item-more" style="display: ${current_page === totalPage ? "none" : "inline-block"}" onClick="handleNextPagination()">•••</span>`
            span += `<span class="item-pagination ${current_page === totalPage ? "active" : ""}" onClick="handleChangePagination(${totalPage})">${totalPage}</span>`
        }

        span += `<span class="item-pagination ${current_page >= totalPage ? "disable" : ""}" onClick="handleNextPagination()">&#10093;</span>`
        span += `<span class="item-pagination ${current_page >= totalPage ? "disable" : ""}" onClick="handleLastPagination()">&#10093;&#10093;</span>`
        $(".wrap-pagination").append(span)
    }
})