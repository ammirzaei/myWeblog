document.getElementById('btnUpload').addEventListener('click', function () {
    const xhttp = new XMLHttpRequest(); // new instance AJAX request

    let file = document.getElementById('inputUpload').files[0];
    const imageStatus = document.querySelector('#imageStatus');
    const progressBar = document.querySelector('.progress-bar');
    const progressDiv = document.getElementById('progressDiv');

    xhttp.onreadystatechange = function () {
        imageStatus.innerHTML = this.responseText;
    }

    xhttp.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            const result = Math.floor((e.loaded / e.total) * 100);
            if (result !== 100) {
                progressBar.innerHTML = result + '%';
                progressBar.style.width = result + '%';
            } else {
                progressDiv.style.display = 'none';
            }
        }
    }

    xhttp.open('post', '/dashboard/image-upload');

    if (file) {
        let formData = new FormData();
        formData.append('image', file);
        progressDiv.style.display = 'block';

        xhttp.send(formData);
    } else {
        imageStatus.innerHTML = 'ابتدا عکسی را انتخاب کنید';
    }

});

CKEDITOR.replace('body', {
    language: 'fa'
});