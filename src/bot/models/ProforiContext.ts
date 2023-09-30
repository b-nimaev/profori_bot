import { ObjectId } from "mongoose";
import { Context, Scenes } from "telegraf";

interface proforiWizardSession extends Scenes.WizardSessionData {
    cost: any,
    positionName: any,
    positions: any
}

interface proforiSession extends Scenes.WizardSession<proforiWizardSession> {

}

interface proforiContext extends Context {
    session: proforiSession;
    scene: Scenes.SceneContextScene<proforiContext, proforiWizardSession>;
    wizard: Scenes.WizardContextWizard<proforiContext>,
    update: any,
    message: any
}

export default proforiContext