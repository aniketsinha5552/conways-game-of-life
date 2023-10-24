const path= require('path')

module.exports={
    mode: "production",
    devServer:{
        static:path.join(__dirname,'dist'),
        compress: true,
        port: 3000
    }
}