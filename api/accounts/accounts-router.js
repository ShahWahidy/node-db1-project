const Accounts = require('./accounts-model')
const router = require('express').Router()
const accountsMiddleware = require('./accounts-middleware')
const dbConfig = require('../../data/db-config')

router.get('/', (req, res, next) => {
  Accounts.getAll()
  .then(accounts => {
    res.json(accounts)
  })
})

router.get('/:id', 
accountsMiddleware.checkAccountId, 
 async (req, res, next) => {
  res.json(req.account)
})

router.post('/', 
accountsMiddleware.checkAccountPayload,
accountsMiddleware.checkAccountNameUnique,
async (req, res, next) => {
  Accounts.create(req.body)
  .then(newAccount => {
      res.status(201).json(newAccount)
    } 
  ).catch(err => {
    next(err)
  })
  // try {
  //   const newAccount = await Accounts.create(req.body)
  //   res.status(201).json(newAccount)
  // } catch (error) {
  //     next(error)
  // }
})

router.put('/:id',
accountsMiddleware.checkAccountId,
accountsMiddleware.checkAccountPayload,
accountsMiddleware.checkAccountNameUnique,
(req, res, next) => {
  Accounts.updateById(req.params.id, req.body)
  .then(updatedAccount => {
    res.json(updatedAccount)
  })
  .catch(err => {
    next(err)
  })
});

router.delete('/:id',
accountsMiddleware.checkAccountId,
(req, res, next) => {
  Accounts.deleteById(req.params.id)
  .then(res.json(req.account))
  .catch(err => {
    next(err)
  })
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack
  })
})

module.exports = router;
