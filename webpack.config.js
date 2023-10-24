const path= require('path')

module.exports={
    mode: "production",
    devServer:{
        static:path.join(__dirname,'dist'),
        compress: true,
        port: 3000
    },

    // to load css
    module:{
        rules:[
            {
               test: /\.css$/,
               use:['style-loader','css-loader']
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader'
            }
        ]
    }
}