var express = require('express');
var member = express.Router();
var db = require('../db');

member.get('/basicInfo', function(req, res) {
    res.render('m_basicInfo')
})

member.get('/myCards', function(req, res) {
    res.render('m_mycards')
})

member.get('/address', function(req, res) {
    res.render('m_address')
})

member.get('/order', function(req, res) {
    res.render('m_order')
})

member.get('/bonus', function(req, res) {
    res.render('m_bonus')
})

member.get('/article', function(req, res) {
    res.render('m_article')
})

module.exports = member;