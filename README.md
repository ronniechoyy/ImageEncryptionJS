# ImageEncrytionJS
Made a javascript image encryt decryt tool for protect webgl usage texture inspired by sketchfab

## Usage

```sh
imageurl           # Import image support Link or DataUrl
8numberPassword    # Input a eight number only password
method             # Should be opposite on encryt and decryt like ecryt in 0 and decrt in 1
fastMode           # Only process the vertical way of pixel

const processedImage = await Roni_ImageEncryt(imageUrl, 8numberPassword, method , fastMode);

Example:
const encrytedImage = await Roni_ImageEncryt('example.com/example_orginal.jpg', '63455326', 0 , 0);
const decrytedImage = await Roni_ImageEncryt('example.com/example_encryted.jpg', '63455326', 1 , 0);

Example2:
const encrytedImage = await Roni_ImageEncryt('example.com/example_orginal.jpg', '63455326', 1 , 1);
const decrytedImage = await Roni_ImageEncryt('example.com/example_encryted.jpg', '63455326', 0 , 1);
```

### commands
