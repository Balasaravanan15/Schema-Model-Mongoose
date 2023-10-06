const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shopApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

//Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be positive ya dodo']
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
});

//Model
/*
const Product = mongoose.model('Product', productSchema)

//Collections or Documents
const bike = new Product({ name: 'Cycling Jersey', price: 2.50 , categories: ['Cycling'], size:'XS'})

bike.save()
    .then(data => {
        console.log("IT WORKED!")
        console.log(data)
    })
    .catch(err => {
        console.log("OH NO ERROR!")
        console.log(err)
    })

/*
Product.findOneAndUpdate({ name: 'Tire Pump' }, { price: -10.99 }, { new: true })
    .then(data => {
        console.log("IT WORKED!")
        console.log(data)
    })
    .catch(err => {
        console.log("OH NO ERROR!")
        console.log(err)
    })

*/
/*
productSchema.methods.greet = function (){
    console.log("HELLO!!! HI!! HOWDY!!!")
    console.log(`- from ${this.name}`)
}
*/
productSchema.methods.toggleOnSale = function() {
    this.onSale =! this.onSale;
    return this.save() ;
}

productSchema.statics.fireSale = function() {
    return this.updateMany({}, {onSale: true, price: 0})
}

productSchema.methods.addCategory = function(newCat) {
    this.categories.push (newCat);
    return this.save();
}

const Product = mongoose.model('Product', productSchema);

const findProduct = async () => {
    const foundProdut = await Product.findOne({ name: 'Mountain Bike' })
    console.log(foundProdut)
    await foundProdut.toggleOnSale();
    console.log(foundProdut)
    await foundProdut.addCategory('Outdoors')
    console.log(foundProdut)
}

Product.fireSale().then(res => console.log(res))

//findProduct();