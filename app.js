document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const imageUpload = document.getElementById('imageUpload');
    const preview = document.getElementById('preview');
    const previewContainer = document.getElementById('preview-container');
    const downloadBtn = document.getElementById('download');
    
    // 图像处理按钮
    const grayscaleBtn = document.getElementById('grayscale');
    const invertBtn = document.getElementById('invert');
    const brightenBtn = document.getElementById('brighten');
    const darkenBtn = document.getElementById('darken');
    const blurBtn = document.getElementById('blur');
    const sharpenBtn = document.getElementById('sharpen');
    const resetBtn = document.getElementById('reset');
    
    // 原始图像数据
    let originalImageData = null;
    // 当前图像数据
    let currentImageData = null;
    // Canvas元素
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    
    // 处理图像上传
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // 设置canvas尺寸
                canvas.width = img.width;
                canvas.height = img.height;
                
                // 绘制图像
                ctx.drawImage(img, 0, 0);
                
                // 保存原始图像数据
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // 显示预览
                preview.src = canvas.toDataURL();
                preview.style.display = 'block';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
    
    // 灰度处理
    grayscaleBtn.addEventListener('click', () => {
        if (!currentImageData) return;
        
        const data = currentImageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // 红
            data[i + 1] = avg; // 绿
            data[i + 2] = avg; // 蓝
        }
        
        updateCanvas();
    });
    
    // 反色处理
    invertBtn.addEventListener('click', () => {
        if (!currentImageData) return;
        
        const data = currentImageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];         // 红
            data[i + 1] = 255 - data[i + 1]; // 绿
            data[i + 2] = 255 - data[i + 2]; // 蓝
        }
        
        updateCanvas();
    });
    
    // 增亮处理
    brightenBtn.addEventListener('click', () => {
        if (!currentImageData) return;
        
        const data = currentImageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(data[i] + 20, 255);         // 红
            data[i + 1] = Math.min(data[i + 1] + 20, 255); // 绿
            data[i + 2] = Math.min(data[i + 2] + 20, 255); // 蓝
        }
        
        updateCanvas();
    });
    
    // 变暗处理
    darkenBtn.addEventListener('click', () => {
        if (!currentImageData) return;
        
        const data = currentImageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(data[i] - 20, 0);         // 红
            data[i + 1] = Math.max(data[i + 1] - 20, 0); // 绿
            data[i + 2] = Math.max(data[i + 2] - 20, 0); // 蓝
        }
        
        updateCanvas();
    });
    
    // 模糊处理 (简单的盒式模糊)
    blurBtn.addEventListener('click', () => {
        if (!currentImageData) return;
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        // 绘制当前图像到临时canvas
        tempCtx.putImageData(currentImageData, 0, 0);
        
        // 应用模糊
        ctx.filter = 'blur(3px)';
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.filter = 'none';
        
        // 更新当前图像数据
        currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // 更新预览
        preview.src = canvas.toDataURL();
    });
    
    // 锐化处理 (使用卷积核)
    sharpenBtn.addEventListener('click', () => {
        if (!currentImageData) return;
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        // 绘制当前图像到临时canvas
        tempCtx.putImageData(currentImageData, 0, 0);
        
        // 应用锐化滤镜
        ctx.filter = 'contrast(1.5)';
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.filter = 'none';
        
        // 更新当前图像数据
        currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // 更新预览
        preview.src = canvas.toDataURL();
    });
    
    // 重置图像
    resetBtn.addEventListener('click', () => {
        if (!originalImageData) return;
        
        // 复制原始图像数据
        currentImageData = new ImageData(
            new Uint8ClampedArray(originalImageData.data),
            originalImageData.width,
            originalImageData.height
        );
        
        updateCanvas();
    });
    
    // 下载图像
    downloadBtn.addEventListener('click', () => {
        if (!currentImageData) return;
        
        const link = document.createElement('a');
        link.download = 'processed-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    
    // 更新Canvas并预览
    function updateCanvas() {
        ctx.putImageData(currentImageData, 0, 0);
        preview.src = canvas.toDataURL();
    }
});