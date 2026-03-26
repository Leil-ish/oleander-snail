(function () {
  var root = document.getElementById("fair-pay-calculator");
  var texasInsuranceRates = {
    "90832": [45.41, 47.49, 40.65, 42.00, 42.00, 51.53, 48.00, 50.94, 54.00, 54.00, 54.22, 54.00],
    "90834": [103.00, 62.67, 53.66, 56.00, 61.28, 67.97, 77.00, 74.00, 75.00, 75.00, 85.85, 75.00],
    "90837": [129.74, 92.83, 79.44, 84.00, 92.04, 102.00, 95.00, 115.00, 112.00, 112.00, 125.80, 112.00],
    "90839": [104.07, 89.29, 76.22, 87.00, 87.00, 96.47, 99.00, 106.58, 113.00, 113.00, 101.62, 113.00],
    "90846": [82.99, 59.47, 51.01, 67.00, 67.00, 64.24, 73.00, 82.24, 75.99, 75.99, 74.79, 75.99],
    "90847": [101.77, 62.01, 53.20, 69.00, 69.00, 67.31, 76.00, 85.57, 78.67, 78.67, 77.73, 78.67]
  };
  var texasCptDescriptions = {
    "90832": "Psychotherapy, 30 minutes",
    "90834": "Psychotherapy, 45 minutes",
    "90837": "Psychotherapy, 60 minutes",
    "90839": "Crisis psychotherapy, first 60 minutes",
    "90846": "Family psychotherapy without patient",
    "90847": "Family psychotherapy with patient"
  };
  var texasCptOrder = ["90832", "90834", "90837", "90839", "90846", "90847"];
  var associateTargetMultiplier = 0.8;
  var currentMode = "w2";
  var modalRoot;

  if (!root) {
    return;
  }

  root.innerHTML = [
    '<div class="fpc-wrap">',
    '  <section class="fair-pay-card fpc-panel" aria-labelledby="fpc-inputs-heading">',
    '    <h3 id="fpc-inputs-heading">Run the numbers</h3>',
    '    <div class="fpc-mode-tabs" role="tablist" aria-label="Employment type">',
    '      <button type="button" class="fpc-mode-tab is-active" data-mode="w2" aria-selected="true">W-2 Clinician</button>',
    '      <button type="button" class="fpc-mode-tab" data-mode="contractor" aria-selected="false">1099 Clinician</button>',
    '    </div>',
    '    <p id="fpc-mode-note" class="fpc-note">W-2 mode assumes the practice may be carrying benefits, payroll, and more support infrastructure, so the fairness benchmark starts from a lower tipping point.</p>',
    '    <div class="fpc-section">',
    '      <h4>Session economics</h4>',
    '      <div class="fpc-grid three">',
    '        <div class="fpc-field">',
    '          <label for="fpc-cash-rate">Cash pay session price</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-cash-rate" name="cashRate" type="number" min="0" step="1" value="150" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '          <small>What a self-pay client would pay for the session you are modeling.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <div class="fpc-label-row">',
    '            <label for="fpc-insurance-rate">Average insurance reimbursement</label>',
    '            <button type="button" class="fpc-field-icon" id="fpc-open-cpt-modal" aria-label="Estimate insurance reimbursement using Texas CPT averages">?</button>',
    '          </div>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-insurance-rate" name="insuranceRate" type="number" min="0" step="1" value="105" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '          <small id="fpc-insurance-help">Use your own average, or turn on the Texas estimate below.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-noshow">No-show or late cancel rate</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-noshow" name="noShowRate" type="number" min="0" max="100" step="1" value="10" />',
    '            <span class="fpc-affix">%</span>',
    '          </div>',
    '          <small>Percent of scheduled sessions that do not complete.</small>',
    '        </div>',
    '      </div>',
    '      <div class="fpc-grid three">',
    '        <div class="fpc-field">',
    '          <label for="fpc-cash-mix">Cash pay clients</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-cash-mix" name="cashMix" type="number" min="0" max="100" step="1" value="20" />',
    '            <span class="fpc-affix">%</span>',
    '          </div>',
    '          <small>Percent of your caseload that is self-pay.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-insurance-mix">Insurance clients</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-insurance-mix" name="insuranceMix" type="number" min="0" max="100" step="1" value="80" />',
    '            <span class="fpc-affix">%</span>',
    '          </div>',
    '          <small>Percent of your caseload using insurance.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-collection">Collection rate</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-collection" name="collectionRate" type="number" min="0" max="100" step="1" value="95" />',
    '            <span class="fpc-affix">%</span>',
    '          </div>',
    '          <small>Percent actually collected after clawbacks or write-offs.</small>',
    '        </div>',
    '      </div>',
    '      <input id="fpc-texas-rate" name="useTexasRate" type="checkbox" class="fpc-is-hidden" />',
    '    </div>',
    '    <div class="fpc-section">',
    '      <h4>Caseload and pay</h4>',
    '      <div class="fpc-grid three">',
    '        <div class="fpc-field">',
    '          <label for="fpc-sessions">Scheduled sessions per week</label>',
    '          <input id="fpc-sessions" name="sessionsPerWeek" type="number" min="0" step="0.5" value="22" />',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-weeks">Working weeks per month</label>',
    '          <input id="fpc-weeks" name="weeksPerMonth" type="number" min="0" step="0.1" value="4.3" />',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-paytype">How are you paid?</label>',
    '          <select id="fpc-paytype" name="payType">',
    '            <option value="flat">Flat rate per completed session</option>',
    '            <option value="percent">Percentage of collected revenue</option>',
    '          </select>',
    '        </div>',
    '      </div>',
    '      <div class="fpc-grid two" id="fpc-pay-fields"></div>',
    '    </div>',
    '    <div class="fpc-section">',
    '      <h4>Benchmark settings</h4>',
    '      <p id="fpc-benchmark-note" class="fpc-note">For fully licensed clinicians, W-2 mode uses a 50/50 post-overhead benchmark. For associates, it uses 80% of that benchmark.</p>',
    '      <div class="fpc-grid two">',
    '        <div class="fpc-field">',
    '          <label for="fpc-clinician-type">Clinician type</label>',
    '          <select id="fpc-clinician-type" name="clinicianType">',
    '            <option value="fullyLicensed">Fully licensed</option>',
    '            <option value="associate">Associate</option>',
    '          </select>',
    '        </div>',
    '      </div>',
    '    </div>',
    '    <div class="fpc-section">',
    '      <h4>Basic overhead</h4>',
    '      <div class="fpc-grid three">',
    '        <div class="fpc-field">',
    '          <label for="fpc-rent">Rent</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-rent" name="rent" type="number" min="0" step="1" value="1000" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-ehr">EHR</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-ehr" name="ehr" type="number" min="0" step="1" value="70" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-liability">Liability insurance</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-liability" name="liability" type="number" min="0" step="1" value="20" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '        </div>',
    '        <div class="fpc-field fpc-associate-only">',
    '          <label for="fpc-supervision">Supervision</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-supervision" name="supervision" type="number" min="0" step="1" value="400" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-bookkeeping">Bookkeeping or tax admin</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-bookkeeping" name="bookkeeping" type="number" min="0" step="1" value="50" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-marketing">Marketing or directory share</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-marketing" name="marketing" type="number" min="0" step="1" value="100" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '        </div>',
    '      </div>',
    '      <div class="fpc-field" style="margin-top: 0.9rem;">',
    '        <label for="fpc-other">Other monthly practice costs</label>',
    '        <div class="fpc-input-affix">',
    '          <input id="fpc-other" name="other" type="number" min="0" step="1" value="0" />',
    '          <span class="fpc-affix">$</span>',
    '        </div>',
    '      </div>',
    '    </div>',
    '    <details class="fpc-section fpc-advanced">',
    '      <summary>Advanced overhead assumptions</summary>',
    '      <p id="fpc-advanced-note" class="fpc-note">Use this if you want to account for benefits, payroll, and per-session processing costs. Leave things at zero if they do not apply.</p>',
    '      <div class="fpc-grid three">',
    '        <div class="fpc-field fpc-w2-only">',
    '          <label for="fpc-benefits">Monthly value of benefits</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-benefits" name="benefits" type="number" min="0" step="1" value="0" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '          <small>Optional. You can use an estimate for health insurance, stipend value, or employer tax burden.</small>',
    '        </div>',
    '        <div class="fpc-field fpc-w2-only">',
    '          <label for="fpc-pto">Monthly PTO benefit value</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-pto" name="ptoBenefit" type="number" min="0" step="1" value="0" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '          <small>Optional. Use this if paid time off is part of the support package and you want it counted separately.</small>',
    '        </div>',
    '        <div class="fpc-field fpc-w2-only">',
    '          <label for="fpc-payroll">Monthly payroll costs</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-payroll" name="payroll" type="number" min="0" step="1" value="120" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '          <small>Average payroll software and processing overhead. Set to zero if not used.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-card-fee">Credit card fee per completed session</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-card-fee" name="cardFeePerSession" type="number" min="0" step="0.5" value="3" />',
    '            <span class="fpc-affix">$</span>',
    '          </div>',
    '          <small>Default assumes about three dollars per completed card transaction.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-biller-rate">Biller fee rate</label>',
    '          <div class="fpc-input-affix">',
    '            <input id="fpc-biller-rate" name="billerFeeRate" type="number" min="0" max="100" step="0.5" value="5" />',
    '            <span class="fpc-affix">%</span>',
    '          </div>',
    '          <small>Optional. Percent of collected revenue paid to a biller. Set to zero if not used.</small>',
    '        </div>',
    '        <div class="fpc-field fpc-w2-only">',
    '          <label for="fpc-benefits-default">Benefits assumption quickfill</label>',
    '          <select id="fpc-benefits-default" name="benefitsDefault">',
    '            <option value="0">No default</option>',
    '            <option value="300">Lean benefits estimate</option>',
    '            <option value="600">Average benefits estimate</option>',
    '            <option value="900">Robust benefits estimate</option>',
    '          </select>',
    '          <small>Optional shortcut if you want to plug in a rough monthly benefits value fast.</small>',
    '        </div>',
    '      </div>',
    '    </details>',
    '    <div class="fpc-actions">',
    '      <button type="button" class="button primary fpc-button" id="fpc-recalculate">Recalculate</button>',
    '      <button type="button" class="button fpc-button" id="fpc-reset">Reset defaults</button>',
    '    </div>',
    '  </section>',
    '  <section class="fair-pay-card fpc-panel" aria-labelledby="fpc-results-heading">',
    '    <h3 id="fpc-results-heading">What the split actually looks like</h3>',
    '    <div id="fpc-results"></div>',
    '  </section>',
    '  <div id="fpc-cpt-modal" class="fpc-modal fpc-is-hidden" aria-hidden="true">',
    '    <div class="fpc-modal-backdrop" data-close-modal="true"></div>',
    '    <div class="fpc-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="fpc-modal-title">',
    '      <button type="button" class="fpc-modal-x" id="fpc-close-cpt-modal" aria-label="Close CPT code picker">×</button>',
    '      <div class="fpc-cpt-card fpc-cpt-modal-card">',
    '        <div class="fpc-cpt-head">',
    '          <h5 id="fpc-modal-title">Primary CPT codes</h5>',
    '          <p id="fpc-cpt-note">Select up to 3. The calculator will average the rounded Texas reimbursement estimates for the codes you use most.</p>',
    '          <p class="fpc-cpt-disclaimer">Codes are weighted evenly in this estimate, so leave out anything that is only a small slice of your practice.</p>',
    '        </div>',
    '        <div class="fpc-check-grid" id="fpc-texas-codes"></div>',
    '        <div class="fpc-modal-actions">',
    '          <button type="button" class="button fpc-button" id="fpc-manual-cpt-modal">Use manual amount</button>',
    '          <button type="button" class="button primary fpc-button" id="fpc-apply-cpt-modal">Calculate average</button>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("");

  var defaults = {
    cashRate: 150,
    insuranceRate: 105,
    collectionRate: 95,
    noShowRate: 10,
    useTexasRate: false,
    cashMix: 20,
    insuranceMix: 80,
    sessionsPerWeek: 22,
    weeksPerMonth: 4.3,
    payType: "flat",
    flatRate: 40,
    splitPercent: 50,
    clinicianType: "fullyLicensed",
    rent: 1000,
    ehr: 70,
    liability: 20,
    supervision: 400,
    bookkeeping: 50,
    marketing: 100,
    other: 0,
    benefits: 0,
    ptoBenefit: 0,
    payroll: 120,
    cardFeePerSession: 3,
    billerFeeRate: 5,
    benefitsDefault: 0
  };

  function currency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  }

  function percent(value) {
    return value.toFixed(1) + "%";
  }

  function points(value) {
    var prefix = value > 0 ? "+" : "";
    return prefix + value.toFixed(1) + " pts";
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getNumber(id) {
    var input = document.getElementById(id);
    var value = parseFloat(input.value);
    return Number.isFinite(value) ? value : 0;
  }

  function average(values) {
    var total = 0;
    for (var i = 0; i < values.length; i += 1) {
      total += values[i];
    }
    return values.length ? total / values.length : 0;
  }

  function roundToNearestFive(value) {
    return Math.round(value / 5) * 5;
  }

  function getTexasCptAverage(code) {
    return roundToNearestFive(average(texasInsuranceRates[code] || []));
  }

  function getSelectedTexasCodes() {
    return Array.prototype.slice.call(
      document.querySelectorAll('input[name="texasCpt"]:checked')
    ).map(function (input) {
      return input.value;
    });
  }

  function renderTexasCodeOptions() {
    var container = document.getElementById("fpc-texas-codes");
    var optionMarkup = texasCptOrder.map(function (code) {
      return [
        '<label class="fpc-check-option">',
        '  <input type="checkbox" name="texasCpt" value="' + code + '"' + (code === "90837" ? ' checked' : '') + ' />',
        '  <span class="fpc-check-copy">',
        '    <strong>' + code + "</strong>",
        '    <small>' + texasCptDescriptions[code] + " • Approx " + currency(getTexasCptAverage(code)) + "</small>",
        "  </span>",
        "</label>"
      ].join("");
    }).join("");

    container.innerHTML = optionMarkup;

    syncTexasSelectionUI();
  }

  function syncTexasRateVisibility() {
    var useTexasRate = document.getElementById("fpc-texas-rate").checked;
    document.getElementById("fpc-insurance-rate").readOnly = useTexasRate;
    document.getElementById("fpc-insurance-rate").setAttribute("aria-readonly", useTexasRate ? "true" : "false");
    document.getElementById("fpc-insurance-help").textContent = useTexasRate
      ? "Using the Texas CPT estimate. Click the question mark to update the codes or switch back to a manual amount."
      : "Enter your own average, or click the question mark to estimate it from common Texas CPT reimbursements.";
  }

  function enforceTexasCodeLimit(changedInput) {
    var selected = getSelectedTexasCodes();
    if (selected.length > 3 && changedInput) {
      changedInput.checked = false;
      return false;
    }

    return true;
  }

  function syncTexasSelectionUI() {
    var selected = getSelectedTexasCodes();
    var note = document.getElementById("fpc-cpt-note");
    var averageRate = selected.length
      ? average(selected.map(getTexasCptAverage))
      : getTexasCptAverage("90837");
    var selectedList = selected.length ? selected.join(", ") : "90837";

    Array.prototype.forEach.call(document.querySelectorAll(".fpc-check-option"), function (label) {
      var input = label.querySelector('input[name="texasCpt"]');
      label.classList.toggle("is-selected", !!(input && input.checked));
    });

    if (note) {
      note.textContent = "Select up to 3. " + selected.length + " selected. Current Texas average: " + currency(averageRate) + " from " + selectedList + ".";
    }

    if (document.getElementById("fpc-texas-rate").checked) {
      document.getElementById("fpc-insurance-rate").value = averageRate.toFixed(0);
    }
  }

  function openTexasModal() {
    var modal = modalRoot || document.getElementById("fpc-cpt-modal");
    modal.classList.remove("fpc-is-hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("fpc-modal-open");
  }

  function closeTexasModal() {
    var modal = modalRoot || document.getElementById("fpc-cpt-modal");
    modal.classList.add("fpc-is-hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("fpc-modal-open");
  }

  function renderPayFields() {
    var container = document.getElementById("fpc-pay-fields");
    var payType = document.getElementById("fpc-paytype").value;

    if (payType === "percent") {
      container.innerHTML = [
        '<div class="fpc-field">',
        '  <label for="fpc-split">Clinician percentage of collected revenue</label>',
        '  <div class="fpc-input-affix">',
        '    <input id="fpc-split" name="splitPercent" type="number" min="0" max="100" step="1" value="' + defaults.splitPercent + '" />',
        '    <span class="fpc-affix">%</span>',
        '  </div>',
        '  <small>Example: enter 60 for a 60/40 split on the clinician side.</small>',
        '</div>'
      ].join("");
    } else {
      container.innerHTML = [
        '<div class="fpc-field">',
        '  <label for="fpc-flat">Your pay per completed session</label>',
        '  <div class="fpc-input-affix">',
        '    <input id="fpc-flat" name="flatRate" type="number" min="0" step="1" value="' + defaults.flatRate + '" />',
        '    <span class="fpc-affix">$</span>',
        '  </div>',
        '  <small>Flat rate paid when a session is completed and collected.</small>',
        '</div>'
      ].join("");
    }
  }

  function getBenchmarkShare(employmentMode, clinicianType) {
    var fullyLicensedTargetNetShare = employmentMode === "contractor" ? 60 : 50;
    return clinicianType === "associate"
      ? fullyLicensedTargetNetShare * associateTargetMultiplier
      : fullyLicensedTargetNetShare;
  }

  function getInterpretation(employmentMode, clinicianType, actualNetShare, benchmarkNetShare, marginPerCompletedSession) {
    var benchmarkDifference = actualNetShare - benchmarkNetShare;

    if (marginPerCompletedSession <= 0) {
      return {
        statusClass: "warn",
        statusLabel: "No positive margin to split",
        statusText: "The calculator is not showing positive post-overhead margin per completed session, so there is no meaningful net-profit split to benchmark."
      };
    }

    if (clinicianType === "associate") {
      if (benchmarkDifference < -5) {
        return {
          statusClass: "warn",
          statusLabel: "Below associate benchmark",
          statusText: "Based on the benchmark used for associates in this mode, the clinician share is landing meaningfully below target."
        };
      }

      if (benchmarkDifference > 5) {
        return {
          statusClass: "good",
          statusLabel: "Stronger than typical associate benchmark",
          statusText: "The clinician share is running meaningfully above the associate benchmark for this mode."
        };
      }

      return {
        statusClass: "caution",
        statusLabel: "Within expected associate range",
        statusText: "The clinician share is landing near the associate benchmark for this mode."
      };
    }

    if (employmentMode === "contractor") {
      if (actualNetShare < 55) {
        return {
          statusClass: "warn",
          statusLabel: "Below common 1099 benchmark",
          statusText: "For a 1099 clinician, the share of post-overhead margin is landing below a stronger contractor benchmark."
        };
      }

      if (actualNetShare < 60) {
        return {
          statusClass: "caution",
          statusLabel: "Slightly below 1099 benchmark",
          statusText: "The clinician share is a little below the contractor benchmark, which means the practice is still retaining a larger share than expected for a 1099 arrangement."
        };
      }

      if (actualNetShare <= 65) {
        return {
          statusClass: "good",
          statusLabel: "Within balanced 1099 range",
          statusText: "The clinician is receiving a contractor-typical share of post-overhead margin."
        };
      }

      return {
        statusClass: "good",
        statusLabel: "Clinician-favoring relative to 1099 benchmark",
        statusText: "The clinician is receiving more than the typical contractor benchmark for post-overhead margin."
      };
    }

    if (actualNetShare < 45) {
      return {
        statusClass: "warn",
        statusLabel: "Below common fairness benchmark",
        statusText: "The clinician is receiving less than 45% of post-overhead margin, which puts the split below a common fairness benchmark for a fully licensed W-2 clinician."
      };
    }

    if (actualNetShare < 50) {
      return {
        statusClass: "caution",
        statusLabel: "Slightly below benchmark",
        statusText: "The clinician share is a little below a balanced 50/50 split of post-overhead margin, which means the owner is still retaining more than half."
      };
    }

    if (actualNetShare <= 55) {
      return {
        statusClass: "good",
        statusLabel: "Within balanced range",
        statusText: "The clinician is receiving about half of post-overhead margin, which reads as roughly balanced."
      };
    }

    return {
      statusClass: "good",
      statusLabel: "Clinician-favoring relative to benchmark",
      statusText: "The clinician is receiving more than half of post-overhead margin, which is stronger than the baseline W-2 benchmark."
    };
  }

  function syncEmploymentModeUI() {
    var isContractor = currentMode === "contractor";
    var isAssociate = document.getElementById("fpc-clinician-type").value === "associate";
    var modeNote = document.getElementById("fpc-mode-note");
    var benchmarkNote = document.getElementById("fpc-benchmark-note");
    var advancedNote = document.getElementById("fpc-advanced-note");

    Array.prototype.forEach.call(root.querySelectorAll(".fpc-mode-tab"), function (button) {
      var isActive = button.getAttribute("data-mode") === currentMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    Array.prototype.forEach.call(root.querySelectorAll(".fpc-w2-only"), function (element) {
      element.classList.toggle("fpc-is-hidden", isContractor);
    });

    Array.prototype.forEach.call(root.querySelectorAll(".fpc-associate-only"), function (element) {
      element.classList.toggle("fpc-is-hidden", !isAssociate);
    });

    modeNote.textContent = isContractor
      ? "1099 mode strips out W-2-only benefits and payroll assumptions, and uses a higher fairness benchmark because contractor arrangements usually do not include those supports."
      : "W-2 mode assumes the practice may be carrying benefits, payroll, and more support infrastructure, so the fairness benchmark starts from a lower tipping point.";

    benchmarkNote.textContent = isContractor
      ? "For fully licensed clinicians, 1099 mode uses a 60/40 post-overhead benchmark on the clinician side. For associates, it uses 80% of that benchmark."
      : "For fully licensed clinicians, W-2 mode uses a 50/50 post-overhead benchmark. For associates, it uses 80% of that benchmark.";

    advancedNote.textContent = isContractor
      ? "Use this if you want to account for contractor-relevant processing costs. W-2-only benefit and payroll fields are hidden in this mode."
      : "Use this if you want to account for benefits, payroll, and per-session processing costs. Leave things at zero if they do not apply.";
  }

  function resetDefaults() {
    currentMode = "w2";
    document.getElementById("fpc-cash-rate").value = defaults.cashRate;
    document.getElementById("fpc-insurance-rate").value = defaults.insuranceRate;
    document.getElementById("fpc-collection").value = defaults.collectionRate;
    document.getElementById("fpc-noshow").value = defaults.noShowRate;
    document.getElementById("fpc-texas-rate").checked = defaults.useTexasRate;
    document.getElementById("fpc-cash-mix").value = defaults.cashMix;
    document.getElementById("fpc-insurance-mix").value = defaults.insuranceMix;
    document.getElementById("fpc-sessions").value = defaults.sessionsPerWeek;
    document.getElementById("fpc-weeks").value = defaults.weeksPerMonth;
    document.getElementById("fpc-paytype").value = defaults.payType;
    document.getElementById("fpc-clinician-type").value = defaults.clinicianType;
    document.getElementById("fpc-rent").value = defaults.rent;
    document.getElementById("fpc-ehr").value = defaults.ehr;
    document.getElementById("fpc-liability").value = defaults.liability;
    document.getElementById("fpc-supervision").value = defaults.supervision;
    document.getElementById("fpc-bookkeeping").value = defaults.bookkeeping;
    document.getElementById("fpc-marketing").value = defaults.marketing;
    document.getElementById("fpc-other").value = defaults.other;
    document.getElementById("fpc-benefits").value = defaults.benefits;
    document.getElementById("fpc-pto").value = defaults.ptoBenefit;
    document.getElementById("fpc-payroll").value = defaults.payroll;
    document.getElementById("fpc-card-fee").value = defaults.cardFeePerSession;
    document.getElementById("fpc-biller-rate").value = defaults.billerFeeRate;
    document.getElementById("fpc-benefits-default").value = String(defaults.benefitsDefault);
    Array.prototype.forEach.call(root.querySelectorAll('input[name="texasCpt"]'), function (input) {
      input.checked = input.value === "90837";
    });
    renderPayFields();
    syncTexasRateVisibility();
    syncEmploymentModeUI();
    syncTexasSelectionUI();
    closeTexasModal();
    calculate();
  }

  function calculate() {
    var cashRate = getNumber("fpc-cash-rate");
    var manualInsuranceRate = getNumber("fpc-insurance-rate");
    var useTexasRate = document.getElementById("fpc-texas-rate").checked;
    var collectionRate = clamp(getNumber("fpc-collection"), 0, 100) / 100;
    var noShowRate = clamp(getNumber("fpc-noshow"), 0, 100) / 100;
    var cashMix = clamp(getNumber("fpc-cash-mix"), 0, 100);
    var insuranceMix = clamp(getNumber("fpc-insurance-mix"), 0, 100);
    var sessionsPerWeek = Math.max(getNumber("fpc-sessions"), 0);
    var weeksPerMonth = Math.max(getNumber("fpc-weeks"), 0);
    var payType = document.getElementById("fpc-paytype").value;
    var clinicianType = document.getElementById("fpc-clinician-type").value;
    var selectedTexasCodes = getSelectedTexasCodes();
    var texasRate = selectedTexasCodes.length
      ? average(selectedTexasCodes.map(getTexasCptAverage))
      : getTexasCptAverage("90837");
    var insuranceRate = useTexasRate ? texasRate : manualInsuranceRate;
    var totalMix = cashMix + insuranceMix;
    var normalizedCashMix = totalMix > 0 ? cashMix / totalMix : 0;
    var normalizedInsuranceMix = totalMix > 0 ? insuranceMix / totalMix : 0;
    var effectiveListedRate = (cashRate * normalizedCashMix) + (insuranceRate * normalizedInsuranceMix);
    var benefitsDefaultValue = getNumber("fpc-benefits-default");
    var benefitsValue = currentMode === "w2" ? getNumber("fpc-benefits") : 0;

    if (currentMode === "w2" && benefitsValue === 0 && benefitsDefaultValue > 0) {
      benefitsValue = benefitsDefaultValue;
    }

    var ptoBenefitValue = currentMode === "w2" ? getNumber("fpc-pto") : 0;
    var payrollValue = currentMode === "w2" ? getNumber("fpc-payroll") : 0;
    var cardFeePerSession = getNumber("fpc-card-fee");
    var billerFeeRate = clamp(getNumber("fpc-biller-rate"), 0, 100) / 100;

    var completedSessions = sessionsPerWeek * weeksPerMonth * (1 - noShowRate);
    var collectedRevenuePerCompletedSession = effectiveListedRate * collectionRate;
    var monthlyRevenue = completedSessions * collectedRevenuePerCompletedSession;
    var monthlyBillerFees = monthlyRevenue * billerFeeRate;
    var monthlyCardFees = completedSessions * cardFeePerSession;

    var monthlyOverhead =
      getNumber("fpc-rent") +
      getNumber("fpc-ehr") +
      getNumber("fpc-liability") +
      (clinicianType === "associate" ? getNumber("fpc-supervision") : 0) +
      getNumber("fpc-bookkeeping") +
      getNumber("fpc-marketing") +
      getNumber("fpc-other") +
      benefitsValue +
      ptoBenefitValue +
      payrollValue +
      monthlyBillerFees +
      monthlyCardFees;

    var overheadPerCompletedSession = completedSessions > 0 ? monthlyOverhead / completedSessions : 0;
    var marginPerCompletedSession = collectedRevenuePerCompletedSession - overheadPerCompletedSession;

    var clinicianPayPerSession = payType === "percent"
      ? collectedRevenuePerCompletedSession * (clamp(getNumber("fpc-split"), 0, 100) / 100)
      : getNumber("fpc-flat");

    var clinicianMonthlyPay = clinicianPayPerSession * completedSessions;
    var practiceRetainedPerSession = collectedRevenuePerCompletedSession - clinicianPayPerSession;
    var clinicianShareGross = collectedRevenuePerCompletedSession > 0
      ? (clinicianPayPerSession / collectedRevenuePerCompletedSession) * 100
      : 0;

    var clinicianShareMargin = marginPerCompletedSession > 0
      ? (clinicianPayPerSession / marginPerCompletedSession) * 100
      : 0;

    var benchmarkTargetNetShare = getBenchmarkShare(currentMode, clinicianType);
    var differenceFromBenchmark = clinicianShareMargin - benchmarkTargetNetShare;
    var interpretation = getInterpretation(
      currentMode,
      clinicianType,
      clinicianShareMargin,
      benchmarkTargetNetShare,
      marginPerCompletedSession
    );

    var legendLeft = marginPerCompletedSession > 0
      ? "Clinician receives " + percent(clamp(clinicianShareMargin, 0, 100)) + " of net margin"
      : "Clinician net share unavailable";
    var legendRight = marginPerCompletedSession > 0
      ? "Practice retains " + percent(clamp(100 - clinicianShareMargin, 0, 100)) + " of net margin"
      : "Practice share unavailable";

    var clinicianBar = marginPerCompletedSession > 0 ? clamp(clinicianShareMargin, 0, 100) : 0;
    var ownerBar = marginPerCompletedSession > 0 ? clamp(100 - clinicianShareMargin, 0, 100) : 0;
    var benchmarkContext = clinicianType === "associate"
      ? "Associate benchmark uses " + percent(associateTargetMultiplier * 100) + " of the fully licensed target for this mode."
      : (currentMode === "contractor"
          ? "1099 mode uses a 60/40 post-overhead benchmark on the clinician side."
          : "W-2 mode uses a 50/50 split of post-overhead margin.");
    var rateContext = useTexasRate
      ? "Insurance estimate is using " + selectedTexasCodes.length + " selected CPT code" + (selectedTexasCodes.length === 1 ? "" : "s") + " averaged to the nearest $5."
      : "Insurance estimate is using your manual average reimbursement input.";

    document.getElementById("fpc-results").innerHTML = [
      '<div class="fpc-callout">',
      '  <div class="fpc-status ' + interpretation.statusClass + '">' + interpretation.statusLabel + "</div>",
      "  <p>" + interpretation.statusText + "</p>",
      "</div>",
      '<div class="fpc-results-grid">',
      '  <div class="fpc-metric">',
      '    <div class="fpc-metric-label">Blended listed session rate</div>',
      '    <div class="fpc-metric-value">' + currency(effectiveListedRate) + "</div>",
      "  </div>",
      '  <div class="fpc-metric">',
      '    <div class="fpc-metric-label">Collected revenue per completed session</div>',
      '    <div class="fpc-metric-value">' + currency(collectedRevenuePerCompletedSession) + "</div>",
      "  </div>",
      '  <div class="fpc-metric">',
      '    <div class="fpc-metric-label">Overhead per completed session</div>',
      '    <div class="fpc-metric-value">' + currency(overheadPerCompletedSession) + "</div>",
      "  </div>",
      '  <div class="fpc-metric">',
      '    <div class="fpc-metric-label">Available margin after overhead</div>',
      '    <div class="fpc-metric-value">' + currency(marginPerCompletedSession) + "</div>",
      "  </div>",
      '  <div class="fpc-metric">',
      '    <div class="fpc-metric-label">Your pay per completed session</div>',
      '    <div class="fpc-metric-value">' + currency(clinicianPayPerSession) + "</div>",
      "  </div>",
      '  <div class="fpc-metric">',
      '    <div class="fpc-metric-label">Your share of gross revenue</div>',
      '    <div class="fpc-metric-value">' + percent(clinicianShareGross) + "</div>",
      "  </div>",
      '  <div class="fpc-metric">',
      '    <div class="fpc-metric-label">Actual share of post-overhead margin</div>',
      '    <div class="fpc-metric-value">' + (marginPerCompletedSession > 0 ? percent(clinicianShareMargin) : "N/A") + "</div>",
      "  </div>",
      '  <div class="fpc-metric">',
      '    <div class="fpc-metric-label">Benchmark target net share</div>',
      '    <div class="fpc-metric-value">' + (marginPerCompletedSession > 0 ? percent(benchmarkTargetNetShare) : "N/A") + "</div>",
      "  </div>",
      '  <div class="fpc-metric">',
      '    <div class="fpc-metric-label">Difference from benchmark</div>',
      '    <div class="fpc-metric-value">' + (marginPerCompletedSession > 0 ? points(differenceFromBenchmark) : "N/A") + "</div>",
      "  </div>",
      "</div>",
      '<div class="fpc-bar" aria-hidden="true">',
      '  <div class="fpc-bar-clinician" style="width:' + clinicianBar + '%;"></div>',
      '  <div class="fpc-bar-owner" style="width:' + ownerBar + '%;"></div>',
      "</div>",
      '<div class="fpc-legend">',
      "  <span>" + legendLeft + "</span>",
      "  <span>" + legendRight + "</span>",
      "</div>",
      '<table class="fpc-table" aria-label="Monthly breakdown">',
      "  <tr><td>Cash pay price</td><td>" + currency(cashRate) + "</td></tr>",
      "  <tr><td>Average insurance rate</td><td>" + currency(insuranceRate) + "</td></tr>",
      "  <tr><td>Cash pay share of caseload</td><td>" + percent(normalizedCashMix * 100) + "</td></tr>",
      "  <tr><td>Insurance share of caseload</td><td>" + percent(normalizedInsuranceMix * 100) + "</td></tr>",
      "  <tr><td>Completed sessions per month</td><td>" + completedSessions.toFixed(1) + "</td></tr>",
      "  <tr><td>Estimated monthly revenue</td><td>" + currency(monthlyRevenue) + "</td></tr>",
      "  <tr><td>Estimated monthly overhead</td><td>" + currency(monthlyOverhead) + "</td></tr>",
      "  <tr><td>Benefits included monthly</td><td>" + currency(benefitsValue) + "</td></tr>",
      "  <tr><td>PTO included monthly</td><td>" + currency(ptoBenefitValue) + "</td></tr>",
      "  <tr><td>Payroll included monthly</td><td>" + currency(payrollValue) + "</td></tr>",
      "  <tr><td>Card fees included monthly</td><td>" + currency(monthlyCardFees) + "</td></tr>",
      "  <tr><td>Biller fees included monthly</td><td>" + currency(monthlyBillerFees) + "</td></tr>",
      "  <tr><td>Your monthly pay</td><td>" + currency(clinicianMonthlyPay) + "</td></tr>",
      "  <tr><td>Practice retained per completed session</td><td>" + currency(practiceRetainedPerSession) + "</td></tr>",
      "</table>",
      '<p class="fpc-help">' + benchmarkContext + " " + rateContext + "</p>"
    ].join("");
  }

  renderPayFields();
  renderTexasCodeOptions();
  modalRoot = document.getElementById("fpc-cpt-modal");
  if (modalRoot && modalRoot.parentNode !== document.body) {
    document.body.appendChild(modalRoot);
  }
  syncTexasRateVisibility();
  syncEmploymentModeUI();
  calculate();

  Array.prototype.forEach.call(root.querySelectorAll(".fpc-mode-tab"), function (button) {
    button.addEventListener("click", function () {
      currentMode = button.getAttribute("data-mode");
      syncEmploymentModeUI();
      calculate();
    });
  });

  document.getElementById("fpc-paytype").addEventListener("change", function () {
    renderPayFields();
    calculate();
  });

  document.getElementById("fpc-clinician-type").addEventListener("change", function () {
    syncEmploymentModeUI();
    calculate();
  });

  document.getElementById("fpc-texas-rate").addEventListener("change", function () {
    syncTexasRateVisibility();
    syncTexasSelectionUI();
    calculate();
  });

  document.getElementById("fpc-open-cpt-modal").addEventListener("click", openTexasModal);
  document.getElementById("fpc-close-cpt-modal").addEventListener("click", closeTexasModal);
  document.getElementById("fpc-apply-cpt-modal").addEventListener("click", function () {
    document.getElementById("fpc-texas-rate").checked = true;
    syncTexasSelectionUI();
    syncTexasRateVisibility();
    calculate();
    closeTexasModal();
  });
  document.getElementById("fpc-manual-cpt-modal").addEventListener("click", function () {
    document.getElementById("fpc-texas-rate").checked = false;
    syncTexasRateVisibility();
    calculate();
    closeTexasModal();
  });

  document.getElementById("fpc-benefits-default").addEventListener("change", function () {
    var benefitsField = document.getElementById("fpc-benefits");
    if (getNumber("fpc-benefits") === 0) {
      benefitsField.value = getNumber("fpc-benefits-default");
    }
    calculate();
  });

  root.addEventListener("input", function () {
    if (document.activeElement && document.activeElement.id === "fpc-insurance-rate") {
      document.getElementById("fpc-texas-rate").checked = false;
      syncTexasRateVisibility();
    }
    calculate();
  });

  function handleTexasCodeChange(event) {
    if (event.target && event.target.name === "texasCpt") {
      if (enforceTexasCodeLimit(event.target)) {
        syncTexasSelectionUI();
        calculate();
      } else {
        syncTexasSelectionUI();
      }
    }
  }

  root.addEventListener("change", handleTexasCodeChange);

  if (modalRoot) {
    modalRoot.addEventListener("change", handleTexasCodeChange);
  }

  root.addEventListener("click", function (event) {
    if (event.target && event.target.id === "fpc-open-cpt-modal") {
      openTexasModal();
      return;
    }
  });

  if (modalRoot) {
    modalRoot.addEventListener("click", function (event) {
      event.stopPropagation();

      if (event.target && event.target.getAttribute("data-close-modal") === "true") {
        closeTexasModal();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modalRoot && modalRoot.getAttribute("aria-hidden") === "false") {
      event.stopPropagation();
      closeTexasModal();
    }
  });

  document.getElementById("fpc-recalculate").addEventListener("click", calculate);
  document.getElementById("fpc-reset").addEventListener("click", resetDefaults);
})();
