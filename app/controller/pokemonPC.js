exports.getPC = (req, res) => {
      res.render('pc', {}, (err, html) => {
        if(!err) console.log(err)

        res.send(html)
      })
}