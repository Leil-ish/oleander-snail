(function () {
  var root = document.getElementById("fair-pay-calculator");

  if (!root) {
    return;
  }

  root.innerHTML = [
    '<div class="fpc-wrap">',
    '  <section class="fair-pay-card fpc-panel" aria-labelledby="fpc-inputs-heading">',
    '    <h3 id="fpc-inputs-heading">Run the numbers</h3>',
    '    <p class="fpc-note">This calculator estimates overhead, then compares how the remaining post-overhead margin is divided.</p>',
    '    <div class="fpc-section">',
    '      <h4>Session economics</h4>',
    '      <div class="fpc-grid three">',
    '        <div class="fpc-field">',
    '          <label for="fpc-rate">Listed fee or average reimbursement</label>',
    '          <input id="fpc-rate" name="rate" type="number" min="0" step="1" value="100" />',
    '          <small>Use a blended average if insurance rates vary.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-collection">Collection rate</label>',
    '          <input id="fpc-collection" name="collectionRate" type="number" min="0" max="100" step="1" value="95" />',
    '          <small>Percent actually collected after clawbacks or write-offs.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-noshow">No-show or late cancel rate</label>',
    '          <input id="fpc-noshow" name="noShowRate" type="number" min="0" max="100" step="1" value="10" />',
    '          <small>Percent of scheduled sessions that do not complete.</small>',
    '        </div>',
    '      </div>',
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
    '      <p class="fpc-note">For fully licensed clinicians, this tool uses a 50/50 post-overhead benchmark. For associates, the benchmark defaults to 80% of the fully licensed benchmark, but you can adjust that.</p>',
    '      <div class="fpc-grid two">',
    '        <div class="fpc-field">',
    '          <label for="fpc-clinician-type">Clinician type</label>',
    '          <select id="fpc-clinician-type" name="clinicianType">',
    '            <option value="fullyLicensed">Fully licensed</option>',
    '            <option value="associate">Associate</option>',
    '          </select>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-associate-multiplier">Associate benchmark multiplier</label>',
    '          <input id="fpc-associate-multiplier" name="associateMultiplier" type="number" min="0" step="0.05" value="0.80" />',
    '          <small>Default assumes associates should earn about 80% of the benchmark used for fully licensed clinicians, recognizing supervision level and reduced independent market value.</small>',
    '        </div>',
    '      </div>',
    '    </div>',
    '    <div class="fpc-section">',
    '      <h4>Basic overhead</h4>',
    '      <div class="fpc-grid three">',
    '        <div class="fpc-field">',
    '          <label for="fpc-rent">Rent</label>',
    '          <input id="fpc-rent" name="rent" type="number" min="0" step="1" value="1000" />',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-ehr">EHR</label>',
    '          <input id="fpc-ehr" name="ehr" type="number" min="0" step="1" value="70" />',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-liability">Liability insurance</label>',
    '          <input id="fpc-liability" name="liability" type="number" min="0" step="1" value="20" />',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-supervision">Supervision</label>',
    '          <input id="fpc-supervision" name="supervision" type="number" min="0" step="1" value="400" />',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-bookkeeping">Bookkeeping or tax admin</label>',
    '          <input id="fpc-bookkeeping" name="bookkeeping" type="number" min="0" step="1" value="50" />',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-marketing">Marketing or directory share</label>',
    '          <input id="fpc-marketing" name="marketing" type="number" min="0" step="1" value="100" />',
    '        </div>',
    '      </div>',
    '      <div class="fpc-field" style="margin-top: 0.9rem;">',
    '        <label for="fpc-other">Other monthly practice costs</label>',
    '        <input id="fpc-other" name="other" type="number" min="0" step="1" value="0" />',
    '      </div>',
    '    </div>',
    '    <details class="fpc-section fpc-advanced">',
    '      <summary>Advanced overhead assumptions</summary>',
    '      <p class="fpc-note">Use this if you want to account for benefits, payroll, and per-session processing costs. Leave things at zero if they do not apply.</p>',
    '      <div class="fpc-grid three">',
    '        <div class="fpc-field">',
    '          <label for="fpc-benefits">Monthly value of benefits</label>',
          '          <input id="fpc-benefits" name="benefits" type="number" min="0" step="1" value="0" />',
    '          <small>Optional. You can use an estimate for health insurance, PTO, stipend value, or employer tax burden.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-payroll">Monthly payroll costs</label>',
    '          <input id="fpc-payroll" name="payroll" type="number" min="0" step="1" value="120" />',
    '          <small>Average payroll software and processing overhead. Set to zero for 1099 arrangements.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-card-fee">Credit card fee per completed session</label>',
    '          <input id="fpc-card-fee" name="cardFeePerSession" type="number" min="0" step="0.5" value="3" />',
    '          <small>Default assumes about three dollars per completed card transaction.</small>',
    '        </div>',
    '        <div class="fpc-field">',
    '          <label for="fpc-biller-rate">Biller fee rate</label>',
    '          <input id="fpc-biller-rate" name="billerFeeRate" type="number" min="0" max="100" step="0.5" value="5" />',
    '          <small>Optional. Percent of collected revenue paid to a biller. Set to zero if not used.</small>',
    '        </div>',
    '        <div class="fpc-field">',
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
    '</div>'
  ].join("");

  var defaults = {
    rate: 100,
    collectionRate: 95,
    noShowRate: 10,
    sessionsPerWeek: 22,
    weeksPerMonth: 4.3,
    payType: "flat",
    flatRate: 40,
    splitPercent: 50,
    clinicianType: "fullyLicensed",
    associateMultiplier: 0.8,
    rent: 1000,
    ehr: 70,
    liability: 20,
    supervision: 400,
    bookkeeping: 50,
    marketing: 100,
    other: 0,
    benefits: 0,
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

  function renderPayFields() {
    var container = document.getElementById("fpc-pay-fields");
    var payType = document.getElementById("fpc-paytype").value;

    if (payType === "percent") {
      container.innerHTML = [
        '<div class="fpc-field">',
        '  <label for="fpc-split">Clinician percentage of collected revenue</label>',
        '  <input id="fpc-split" name="splitPercent" type="number" min="0" max="100" step="1" value="' + defaults.splitPercent + '" />',
        '  <small>Example: enter 60 for a 60/40 split on the clinician side.</small>',
        '</div>'
      ].join("");
    } else {
      container.innerHTML = [
        '<div class="fpc-field">',
        '  <label for="fpc-flat">Your pay per completed session</label>',
        '  <input id="fpc-flat" name="flatRate" type="number" min="0" step="1" value="' + defaults.flatRate + '" />',
        '  <small>Flat rate paid when a session is completed and collected.</small>',
        '</div>'
      ].join("");
    }
  }

  function getInterpretation(clinicianType, actualNetShare, benchmarkNetShare, marginPerCompletedSession) {
    if (marginPerCompletedSession <= 0) {
      return {
        statusClass: "warn",
        statusLabel: "No positive margin to split",
        statusText: "The calculator is not showing positive post-overhead margin per completed session, so there is no meaningful net-profit split to benchmark."
      };
    }

    if (clinicianType === "associate") {
      var associateDifference = actualNetShare - benchmarkNetShare;

      if (associateDifference < -5) {
        return {
          statusClass: "warn",
          statusLabel: "Below associate benchmark",
          statusText: "Based on the benchmark you set for associates, the practice is retaining more than the expected share of post-overhead margin."
        };
      }

      if (associateDifference > 5) {
        return {
          statusClass: "good",
          statusLabel: "Stronger than typical associate benchmark",
          statusText: "The clinician share is running meaningfully above the associate benchmark you set for post-overhead margin."
        };
      }

      return {
        statusClass: "caution",
        statusLabel: "Within expected associate range",
        statusText: "The clinician share is landing near the associate benchmark for post-overhead margin."
      };
    }

    if (actualNetShare < 45) {
      return {
        statusClass: "warn",
        statusLabel: "Below common fairness benchmark",
        statusText: "The clinician is receiving less than 45% of post-overhead margin, which puts the split below a common fairness benchmark for a fully licensed clinician."
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
      statusText: "The clinician is receiving more than half of post-overhead margin, which is stronger than the baseline benchmark."
    };
  }

  function resetDefaults() {
    document.getElementById("fpc-rate").value = defaults.rate;
    document.getElementById("fpc-collection").value = defaults.collectionRate;
    document.getElementById("fpc-noshow").value = defaults.noShowRate;
    document.getElementById("fpc-sessions").value = defaults.sessionsPerWeek;
    document.getElementById("fpc-weeks").value = defaults.weeksPerMonth;
    document.getElementById("fpc-paytype").value = defaults.payType;
    document.getElementById("fpc-clinician-type").value = defaults.clinicianType;
    document.getElementById("fpc-associate-multiplier").value = defaults.associateMultiplier.toFixed(2);
    document.getElementById("fpc-rent").value = defaults.rent;
    document.getElementById("fpc-ehr").value = defaults.ehr;
    document.getElementById("fpc-liability").value = defaults.liability;
    document.getElementById("fpc-supervision").value = defaults.supervision;
    document.getElementById("fpc-bookkeeping").value = defaults.bookkeeping;
    document.getElementById("fpc-marketing").value = defaults.marketing;
    document.getElementById("fpc-other").value = defaults.other;
    document.getElementById("fpc-benefits").value = defaults.benefits;
    document.getElementById("fpc-payroll").value = defaults.payroll;
    document.getElementById("fpc-card-fee").value = defaults.cardFeePerSession;
    document.getElementById("fpc-biller-rate").value = defaults.billerFeeRate;
    document.getElementById("fpc-benefits-default").value = String(defaults.benefitsDefault);
    renderPayFields();
    calculate();
  }

  function calculate() {
    var listedRate = getNumber("fpc-rate");
    var collectionRate = clamp(getNumber("fpc-collection"), 0, 100) / 100;
    var noShowRate = clamp(getNumber("fpc-noshow"), 0, 100) / 100;
    var sessionsPerWeek = Math.max(getNumber("fpc-sessions"), 0);
    var weeksPerMonth = Math.max(getNumber("fpc-weeks"), 0);
    var payType = document.getElementById("fpc-paytype").value;
    var clinicianType = document.getElementById("fpc-clinician-type").value;
    var associateMultiplier = Math.max(getNumber("fpc-associate-multiplier"), 0);

    var benefitsDefaultValue = getNumber("fpc-benefits-default");
    var benefitsValue = getNumber("fpc-benefits");
    if (benefitsValue === 0 && benefitsDefaultValue > 0) {
      benefitsValue = benefitsDefaultValue;
    }

    var payrollValue = getNumber("fpc-payroll");
    var cardFeePerSession = getNumber("fpc-card-fee");
    var billerFeeRate = clamp(getNumber("fpc-biller-rate"), 0, 100) / 100;

    var completedSessions = sessionsPerWeek * weeksPerMonth * (1 - noShowRate);
    var collectedRevenuePerCompletedSession = listedRate * collectionRate;
    var monthlyRevenue = completedSessions * collectedRevenuePerCompletedSession;
    var monthlyBillerFees = monthlyRevenue * billerFeeRate;
    var monthlyCardFees = completedSessions * cardFeePerSession;

    var monthlyOverhead =
      getNumber("fpc-rent") +
      getNumber("fpc-ehr") +
      getNumber("fpc-liability") +
      getNumber("fpc-supervision") +
      getNumber("fpc-bookkeeping") +
      getNumber("fpc-marketing") +
      getNumber("fpc-other") +
      benefitsValue +
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

    var fullyLicensedTargetNetShare = 50;
    var associateTargetNetShare = fullyLicensedTargetNetShare * associateMultiplier;
    var benchmarkTargetNetShare = clinicianType === "associate"
      ? associateTargetNetShare
      : fullyLicensedTargetNetShare;
    var differenceFromBenchmark = clinicianShareMargin - benchmarkTargetNetShare;

    var interpretation = getInterpretation(
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

    var clinicianBar = marginPerCompletedSession > 0
      ? clamp(clinicianShareMargin, 0, 100)
      : 0;
    var ownerBar = marginPerCompletedSession > 0
      ? clamp(100 - clinicianShareMargin, 0, 100)
      : 0;

    var benchmarkContext = clinicianType === "associate"
      ? "Associate benchmark uses " + percent(associateMultiplier * 100) + " of the fully licensed target."
      : "Fully licensed benchmark uses a 50/50 split of post-overhead margin.";

    document.getElementById("fpc-results").innerHTML = [
      '<div class="fpc-callout">',
      '  <div class="fpc-status ' + interpretation.statusClass + '">' + interpretation.statusLabel + "</div>",
      "  <p>" + interpretation.statusText + "</p>",
      "</div>",
      '<div class="fpc-results-grid">',
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
      "  <tr><td>Completed sessions per month</td><td>" + completedSessions.toFixed(1) + "</td></tr>",
      "  <tr><td>Estimated monthly revenue</td><td>" + currency(monthlyRevenue) + "</td></tr>",
      "  <tr><td>Estimated monthly overhead</td><td>" + currency(monthlyOverhead) + "</td></tr>",
      "  <tr><td>Benefits included monthly</td><td>" + currency(benefitsValue) + "</td></tr>",
      "  <tr><td>Payroll included monthly</td><td>" + currency(payrollValue) + "</td></tr>",
      "  <tr><td>Card fees included monthly</td><td>" + currency(monthlyCardFees) + "</td></tr>",
      "  <tr><td>Biller fees included monthly</td><td>" + currency(monthlyBillerFees) + "</td></tr>",
      "  <tr><td>Your monthly pay</td><td>" + currency(clinicianMonthlyPay) + "</td></tr>",
      "  <tr><td>Practice retained per completed session</td><td>" + currency(practiceRetainedPerSession) + "</td></tr>",
      "</table>",
      '<p class="fpc-help">' + benchmarkContext + "</p>"
    ].join("");
  }

  renderPayFields();
  calculate();

  document.getElementById("fpc-paytype").addEventListener("change", function () {
    renderPayFields();
    calculate();
  });

  document.getElementById("fpc-benefits-default").addEventListener("change", function () {
    var benefitsField = document.getElementById("fpc-benefits");
    if (getNumber("fpc-benefits") === 0) {
      benefitsField.value = getNumber("fpc-benefits-default");
    }
    calculate();
  });

  root.addEventListener("input", function () {
    calculate();
  });

  document.getElementById("fpc-recalculate").addEventListener("click", calculate);
  document.getElementById("fpc-reset").addEventListener("click", resetDefaults);
})();
