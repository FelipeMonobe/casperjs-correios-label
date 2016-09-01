var casper = require('casper').create(),
  correiosLabelURL = 'http://www2.correios.com.br/enderecador/encomendas/default.cfm',
  formSelector = 'form[name="form1"]',
  formCopySender = 'javascript:mesmaEtiqueta(1,\'i\')',
  formCopyRecipient = 'javascript:mesmaEtiqueta(1,\'p\')',
  labelPage = /gerarEtiqueta\.cfm/,
  postData = JSON.parse(casper.cli.args),
  senderFormCEP = { 'input[name="cep_1"]': postData.sender.zip },
  recipientFormCEP = { 'input[name="desCep_1"]': postData.recipient.zip },
  formBody = {
    // SENDER DATA
    'input[name="nome_1"]': postData.sender.name,
    'input[name="empresa_1"]': postData.sender.company,
    'input[name="numero_1"]': postData.sender.number,
    'input[name="complemento_1"]': postData.sender.complement,
    'input[name="telefone_1"]': postData.sender.phone,

    // RECIPIENT DATA
    'input[name="desNome_1"]': postData.recipient.name,
    'input[name="desEmpresa_1"]': postData.recipient.company,
    'input[name="desNumero_1"]': postData.recipient.number,
    'input[name="desComplemento_1"]': postData.recipient.complement,
    'input[name="desTelefone_1"]': postData.recipient.phone,
    'textarea[name="desDC_1"]': postData.recipient.description
  };

main();

function main() {
  // 1. STARTING NAVIGATION
  casper.start(correiosLabelURL, startCallback);
  casper.run();
}

function startCallback() {
  // 2. INPUTING CEP
  casper.fillSelectors(formSelector, senderFormCEP);
  casper.click('p');
  casper.waitForSelector(formSelector, firstWaitCallback);
}

function firstWaitCallback() {
  casper.fillSelectors(formSelector, recipientFormCEP);
  casper.click('p');
  casper.waitForSelector(formSelector, waitCallback);
}

function waitCallback() {
  // 3. COMPLETING FORMS
  casper.fillSelectors(formSelector, formBody);

  // 4. COPYING FORMS
  casper.click('a[href="' + formCopySender + '"]');
  casper.click('a[href="' + formCopyRecipient + '"]');

  // 5. SUBMIT FORMS
  casper.click('#btGerarEtiquetas');

  casper.waitForPopup(labelPage, waitForPopupCallback);
}

function waitForPopupCallback() {
  casper.withPopup(labelPage, withPopupCallback);
}

function withPopupCallback() {
  // 6. SEND DATA BACK
  casper.wait(500, function() {
    casper.echo(casper.captureBase64('jpg'));
  });
}
