

function Addimage(img_link) {
    return new Promise((resolve, reject) => {
        (async () => {
            const newimg = await fetch(img_link)
            resolve(URL.createObjectURL(await newimg.blob()))
        })()
    })
}

function ColorChannelGroupToPixel(array_original) {
    var pixelarray = [];
    var i = 0, data_length = array_original.data.length;
    for (let i = 0; i < data_length; i = i + 4) {
        pixelarray.push([
            array_original.data[i],
            array_original.data[i + 1],
            array_original.data[i + 2],
            array_original.data[i + 3]
        ])
    }
    return pixelarray;
}

function PixelGroupTo2DArray(Array_1d, x_size, y_size) {
    var Array2D = [];
    for (let x = 0; x < x_size; x++) {
        var Array2D_singleline = [];
        for (let y = 0; y < y_size; y = y + 1) {
            Array2D_singleline.push(Array_1d[(y_size * x) + y]);
        }
        Array2D.push(Array2D_singleline)
    }
    return Array2D;
}

function PixelShift(array_orginal, offset_start, offset_per_step, pos_or_nega = 0) {
    var difficulty = 1;
    var array_processed = []

    for (let x = 0; x < array_orginal.length; x = x + difficulty) {

        offset_start = offset_start + offset_per_step;

        if (offset_start > array_orginal[0].length) {
            offset_start = offset_start - array_orginal[0].length;
        }
        
        for (let dif = 0; dif < difficulty; dif++) {
            if (pos_or_nega == 0) {
                array_processed.push(offset(array_orginal[x + dif], offset_start));
            } else {
                array_processed.push(offset(array_orginal[x + dif], -offset_start));
            }
            
        }

    }
    
    return array_processed;
}

function Reverse2DArray(array2D_input) {
    var array2D_reversed = [];
    for (let x = 0; x < array2D_input[0].length; x++) {
        var array2D_reversed_width = [];
        for (let y = 0; y < array2D_input.length; y++) {
            array2D_reversed_width.push(array2D_input[y][x])
        }
        array2D_reversed.push(array2D_reversed_width);
    }
    
    return array2D_reversed;
}

function Flat2DArrayDeepCopy(array_2d_original, array_foroverwrite) {
    var array_1d = [];
    for (let i = 0; i < array_2d_original.length; i++) {
        var array_pixel = [];
        for (let ii = 0; ii < array_2d_original[i].length; ii++) {
            for (let iii = 0; iii < array_2d_original[i][ii].length; iii++) {
                array_1d.push(array_2d_original[i][ii][iii]);
            }
        }
    }
    for (let x = 0; x < array_1d.length; x++) {
        array_foroverwrite[x] = array_1d[x];
    }
    return array_1d;
}

const offset = (arr, offset) => [...arr.slice(offset), ...arr.slice(0, offset)];

async function ImageEncryt_inner(
    Img_original_url,
    x_offset_start, x_offset_per_step, y_offset_start, y_offset_per_step,
    Encrypt_or_Decryt, Fast_mode = 0) {
    return new Promise((resolve, reject) => {
        (async () => {
            const xx = new Image();
            xx.src = await Addimage(Img_original_url);

            const canv = document.createElement('canvas');
            canv.style.display = 'none';
            const canvContext = canv.getContext('2d');

            xx.onload = function () {
                //console.log('xx.height,xx.width', xx.height, xx.width)

                canv.height = xx.height;
                canv.width = xx.width;
                canvContext.drawImage(xx, 0, 0, xx.width, xx.height);
                var id = canvContext.getImageData(0, 0, xx.width, xx.height);

                //Create new Canvas
                const canv2 = document.createElement('canvas');
                const canvContext2 = canv2.getContext('2d');
                canv2.style.display = 'none'
                canv2.height = xx.height;
                canv2.width = xx.width;
                //document.body.appendChild(canv2);

                //#region Turn Color Channel Array To Pixel 2D array
                var id2 = canvContext2.createImageData(xx.width, xx.height);

                var color_array = ColorChannelGroupToPixel(id);

                var color_array_height = PixelGroupTo2DArray(color_array, xx.height, xx.width);
                //#endregion

                //#region Encrypt process
                if (Encrypt_or_Decryt == 0) {
                    //Horizontial Shift
                    var p_layer1 = PixelShift(color_array_height, x_offset_start, x_offset_per_step);

                    if (Fast_mode == 0) {
                        //Vertical  Shift
                        var p_layer2 = Reverse2DArray(p_layer1);
                        var p_layer3 = PixelShift(p_layer2, y_offset_start, y_offset_per_step);
                        var p_layer4 = Reverse2DArray(p_layer3);
                    } else {
                        var p_layer4 = p_layer1;
                    }

                } else {
                    if (Fast_mode == 0) {
                        //Vertical  Shift
                        var p_layer1 = Reverse2DArray(color_array_height);
                        var p_layer2 = PixelShift(p_layer1, y_offset_start, y_offset_per_step, 1);
                        var p_layer3 = Reverse2DArray(p_layer2);
                    } else {
                        var p_layer3 = color_array_height;
                    }

                    //Horizontial Shift
                    var p_layer4 = PixelShift(p_layer3, x_offset_start, x_offset_per_step, 1);
                }
                //#endregion

                id2.data = Flat2DArrayDeepCopy(p_layer4, id2.data);

                canvContext2.putImageData(id2, 0, 0);
                const Encryted_img = canv2.toDataURL();
                
                resolve(Encryted_img);
            }

        })()

    })

}

async function ImageEncryt(url, password, method, Fast_mode) {
    //password
    var pw_array = password.match(/.{1,2}/g);
    
    return await ImageEncryt_inner(url, parseInt(pw_array[0]), parseInt(pw_array[1]), parseInt(pw_array[2]), parseInt(pw_array[3]), method, Fast_mode);
}