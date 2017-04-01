
    // This is the trial that should be created by ADD_TRIAL
    const newTrial = Object.assign({}, InitialTrial);
    delete newTrial['id'];
    newTrial['id'] = String(index);
