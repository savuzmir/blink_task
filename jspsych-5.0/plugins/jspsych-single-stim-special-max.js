/**
 * jspsych-single-stim
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["single-stim-special-max"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('single-stim-special-max', 'stimulus', 'image');

  plugin.trial = function(display_element, trial) {

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
    trial.feedback = trial.feedback || "";
    // set default values for the parameters
    trial.choices = trial.choices || [];
    trial.response_ends_trial = (typeof trial.response_ends_trial == 'undefined') ? true : trial.response_ends_trial;
    trial.timing_stim = trial.timing_stim || -1;
    trial.timing_response = trial.timing_response || -1;
    trial.is_html = (typeof trial.is_html == 'undefined') ? false : trial.is_html;
    trial.prompt = trial.prompt || "";
    trial.condition = trial.condition || "undefined";

    // this array holds handlers from setTimeout calls
    // that need to be cleared if the trial ends early
    var setTimeoutHandlers = [];
    var press = 0;

      // display stimulus
      display_element.append($('<div>', {
        html: trial.stimulus,
        id: 'jspsych-single-stim-stimulus'
      }));



    // store response
    var response = {
        rt: -1,
        key: -1,
        points_low: 0,
        points_high: 0
    };


    // function to end trial when it is time
    var end_trial = function() {
      // kill any remaining setTimeout handlers
      for (var i = 0; i < setTimeoutHandlers.length; i++) {
        clearTimeout(setTimeoutHandlers[i]);
      }

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
          "points_low": response.points_low,
          "points_high": response.points_high
      };

      // clear the display
      display_element.html('');

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      display_element.html('');

      if (trial.condition == -1) {
        if (info.rt >= 1 && info.rt <= 200) {
            points_low += 20}
        else if (info.rt >= 200 && info.rt < 400) {
            points_low += 10}
        else if (info.rt >= 400 && info.rt < 500) {
            points_low  += 5}
        else if (info.rt >= 500 && info.rt < 600) {
            points_low += 2}
      if (press==0 && info.rt < 600) {
          display_element.append($('<div>', {
            html: '<img style="position: absolute; top: 30%; height: 30%; left: 70%" src="img/correct.png">',
              id: 'jspsych-single-stim-pic-prompt'
        }))}
      else if (press==0 && info.rt > 600) {
          display_element.append($('<div>', {
            html: '<img style="position: absolute; top: 30%; height: 30%; left: 70%" src="img/incorrect.png">',
              id: 'jspsych-single-stim-pic-prompt'
          }))}
      else {
          points_low = points_low -10;
        display_element.append($('<div>', {
          html: '<img style="position: absolute; top: 30%; height: 30%; left: 70%" src="img/incorrect.png">',
            id: 'jspsych-single-stim-pic-prompt'
        }));
      }}
      else if (trial.condition == 1) {
        if (info.rt >= 1 && info.rt <= 200) {
            points_high  += 200}
        else if (info.rt >= 200 && info.rt < 400) {
            points_high += 100}
        else if (info.rt >= 400 && info.rt < 500) {
            points_high += 50}
        else if (info.rt >= 500 && info.rt < 600) {
            points_high += 20}
        if (press==0 && info.rt < 600) {
          display_element.append($('<div>', {
            html: '<img style="position: absolute; top: 30%; height: 30%; left: 70%" src="img/correct.png">',
              id: 'jspsych-single-stim-pic-prompt'
          }))}
        else if (press==0 && info.rt > 600) {
                display_element.append($('<div>', {
                    html: '<img style="position: absolute; top: 30%; height: 30%; left: 70%" src="img/incorrect.png">',
                    id: 'jspsych-single-stim-pic-prompt'
                }))}
        else {
          points_high = points_high -10;
          display_element.append($('<div>', {
            html: '<img style="position: absolute; top: 30%; height: 30%; left: 70%" src="img/incorrect.png">',
              id: 'jspsych-single-stim-pic-prompt'
          }))}
      }

      press = 1;

      if (trial.timing_stim > 0) {
        t8 = setTimeout(function () {
          $('#jspsych-single-stim-pic-prompt').css('visibility', 'hidden');
        }, trial.timing_stim);
        setTimeoutHandlers.push(t8);
      }
      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      $("#jspsych-single-stim-stimulus").addClass('responded');

      // only record the first response

      if (response.key == -1) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: true,
        allow_held_key: false
      });
    }

    // hide image if timing is set
    if (trial.timing_stim > 0) {
      var t1 = setTimeout(function() {
        $('#jspsych-single-stim-stimulus').css('visibility', 'hidden');
      }, trial.timing_stim);
      setTimeoutHandlers.push(t1);
    }

    // end trial if time limit is set
    if (trial.timing_response > 0) {
      var t2 = setTimeout(function() {
        end_trial();
      }, trial.timing_response);
      setTimeoutHandlers.push(t2);
    }

  };

  return plugin;
})();
