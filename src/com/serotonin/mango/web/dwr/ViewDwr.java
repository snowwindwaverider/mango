/*
    Mango - Open Source M2M - http://mango.serotoninsoftware.com
    Copyright (C) 2006-2011 Serotonin Software Technologies Inc.
    @author Matthew Lohbihler
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.serotonin.mango.web.dwr;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;

import com.serotonin.db.IntValuePair;
import com.serotonin.db.KeyValuePair;
import com.serotonin.mango.Common;
import com.serotonin.mango.db.dao.DataPointDao;
import com.serotonin.mango.db.dao.ViewDao;
import com.serotonin.mango.rt.RuntimeManager;
import com.serotonin.mango.rt.dataImage.DataPointRT;
import com.serotonin.mango.rt.dataImage.PointValueTime;
import com.serotonin.mango.view.DynamicImage;
import com.serotonin.mango.view.ImageSet;
import com.serotonin.mango.view.ImplDefinition;
import com.serotonin.mango.view.ShareUser;
import com.serotonin.mango.view.View;
import com.serotonin.mango.view.component.AnalogGraphicComponent;
import com.serotonin.mango.view.component.BinaryGraphicComponent;
import com.serotonin.mango.view.component.CompoundChild;
import com.serotonin.mango.view.component.CompoundComponent;
import com.serotonin.mango.view.component.DynamicGraphicComponent;
import com.serotonin.mango.view.component.HtmlComponent;
import com.serotonin.mango.view.component.ImageChartComponent;
import com.serotonin.mango.view.component.MultistateGraphicComponent;
import com.serotonin.mango.view.component.PointComponent;
import com.serotonin.mango.view.component.ScriptComponent;
import com.serotonin.mango.view.component.SimpleCompoundComponent;
import com.serotonin.mango.view.component.SimplePointComponent;
import com.serotonin.mango.view.component.ThumbnailComponent;
import com.serotonin.mango.view.component.ViewComponent;
import com.serotonin.mango.view.text.TextRenderer;
import com.serotonin.mango.vo.AnonymousUser;
import com.serotonin.mango.vo.DataPointExtendedNameComparator;
import com.serotonin.mango.vo.DataPointVO;
import com.serotonin.mango.vo.User;
import com.serotonin.mango.vo.permission.PermissionException;
import com.serotonin.mango.vo.permission.Permissions;
import com.serotonin.mango.web.dwr.beans.DataPointBean;
import com.serotonin.mango.web.dwr.beans.ViewComponentState;
import com.serotonin.util.StringUtils;
import com.serotonin.web.dwr.DwrResponseI18n;
import com.serotonin.web.dwr.MethodFilter;

/**
 * This class is so not threadsafe. Do not use class fields except for the resource bundle stuff.
 * 
 * @author mlohbihler
 */
public class ViewDwr extends BaseDwr {
    //
    //
    // /
    // / Anonymous views
    // /
    //
    //
    public List<ViewComponentState> getViewPointDataAnon(int viewId) {
        View view = Common.getAnonymousView(viewId);
        if (view == null)
            return new ArrayList<ViewComponentState>();
        return getViewPointData(null, view, false);
    }

    public String setViewPointAnon(int viewId, String viewComponentId, String valueStr) {
        View view = Common.getAnonymousView(viewId);
        if (view == null)
            throw new PermissionException("View is not in session", null);

        if (view.getAnonymousAccess() != ShareUser.ACCESS_SET)
            throw new PermissionException("Point is not anonymously settable", null);

        // Allow the set.
        setPointImpl(view.findDataPoint(viewComponentId), valueStr, new AnonymousUser());

        return viewComponentId;
    }

    /**
     * Retrieves point state for all points on a given view. This is the monitoring version of the method. See below for
     * the view editing version.
     * 
     * @param viewId
     * @return
     */
    @MethodFilter
    public List<ViewComponentState> getViewPointData(boolean edit) {
        User user = Common.getUser();
        return getViewPointData(user, user.getView(), edit);
    }

    private List<ViewComponentState> getViewPointData(User user, View view, boolean edit) {
        WebContext webContext = WebContextFactory.get();
        HttpServletRequest request = webContext.getHttpServletRequest();
        List<ViewComponentState> states = new ArrayList<ViewComponentState>();
        Map<String, Object> model = new HashMap<String, Object>();
        RuntimeManager rtm = Common.ctx.getRuntimeManager();

        for (ViewComponent viewComponent : view.getViewComponents()) {
            if (viewComponent.isCompoundComponent() && (edit || viewComponent.isVisible())) {
                CompoundComponent compoundComponent = (CompoundComponent) viewComponent;

                boolean imageChart = compoundComponent instanceof ImageChartComponent;

                // Add states for each of the children
                for (CompoundChild child : compoundComponent.getChildComponents())
                    addPointComponentState(child.getViewComponent(), rtm, model, request, view, user, states, edit,
                            !imageChart);

                // Add a state for the compound component.
                ViewComponentState state = new ViewComponentState();
                state.setId(compoundComponent.getId());

                model.clear();
                model.put("compoundComponent", compoundComponent);

                List<Map<String, Object>> childData = new ArrayList<Map<String, Object>>();
                for (CompoundChild child : compoundComponent.getChildComponents()) {
                    if (child.getViewComponent().isPointComponent()) {
                        DataPointVO point = ((PointComponent) child.getViewComponent()).tgetDataPoint();
                        if (point != null) {
                            Map<String, Object> map = new HashMap<String, Object>();
                            if (imageChart)
                                map.put("name", point.getName());
                            else
                                map.put("name", getMessage(child.getDescription()));
                            map.put("point", point);
                            map.put("pointValue", point.lastValue());
                            childData.add(map);
                        }
                    }
                }
                model.put("childData", childData);

                if (compoundComponent.hasInfo())
                    state.setInfo(generateContent(request, "compoundInfoContent.jsp", model));

                if (imageChart)
                    state.setContent(((ImageChartComponent) compoundComponent).getImageChartData(getResourceBundle()));
                else if (!edit)
                    state.setChart(compoundComponent.getImageChartData(getResourceBundle()));

                states.add(state);
            }
            else
                addPointComponentState(viewComponent, rtm, model, request, view, user, states, edit, true);
        }

        return states;
    }

    private void addPointComponentState(ViewComponent viewComponent, RuntimeManager rtm, Map<String, Object> model,
            HttpServletRequest request, View view, User user, List<ViewComponentState> states, boolean edit, boolean add) {
        if (viewComponent.isPointComponent() && (edit || viewComponent.isVisible())) {
            PointComponent pointComponent = (PointComponent) viewComponent;

            DataPointRT dataPointRT = null;
            if (pointComponent.tgetDataPoint() != null)
                dataPointRT = rtm.getDataPoint(pointComponent.tgetDataPoint().getId());

            ViewComponentState state = preparePointComponentState(pointComponent, user, dataPointRT, model, request);

            if (!edit) {
                if (pointComponent.isSettable()) {
                    int access = view.getUserAccess(user);
                    if (access == ShareUser.ACCESS_OWNER || access == ShareUser.ACCESS_SET)
                        setChange(pointComponent.tgetDataPoint(), state, dataPointRT, request, model);
                }

                if (pointComponent.tgetDataPoint() != null)
                    setChart(pointComponent.tgetDataPoint(), state, request, model);
            }

            if (add)
                states.add(state);

            model.clear();
        }
    }

    /**
     * Shared convenience method for creating a populated view component state.
     */
    private ViewComponentState preparePointComponentState(PointComponent pointComponent, User user, DataPointRT point,
            Map<String, Object> model, HttpServletRequest request) {
        ViewComponentState state = new ViewComponentState();
        state.setId(pointComponent.getId());

        PointValueTime pointValue = prepareBasePointState(pointComponent.getId(), state,
                pointComponent.tgetDataPoint(), point, model);

        model.put("pointComponent", pointComponent);
        if (pointComponent.isValid())
            setEvents(pointComponent.tgetDataPoint(), user, model);

        pointComponent.addDataToModel(model, pointValue);

        if (!pointComponent.isValid())
            model.put("invalid", "true");
        else {
            // Add the rendered text as a convenience to the snippets.
            model.put("text",
                    pointComponent.tgetDataPoint().getTextRenderer().getText(pointValue, TextRenderer.HINT_FULL));

            state.setContent(generateContent(request, pointComponent.snippetName() + ".jsp", model));
            pointComponent.tgetDataPoint().updateLastValue(pointValue);
        }

        state.setInfo(generateContent(request, "infoContent.jsp", model));
        setMessages(state, request, "warningContent", model);

        return state;
    }

    //
    // View users
    //
    @MethodFilter
    public List<ShareUser> addUpdateSharedUser(int userId, int accessType) {
        View view = Common.getUser().getView();
        boolean found = false;
        for (ShareUser su : view.getViewUsers()) {
            if (su.getUserId() == userId) {
                found = true;
                su.setAccessType(accessType);
                break;
            }
        }

        if (!found) {
            ShareUser su = new ShareUser();
            su.setUserId(userId);
            su.setAccessType(accessType);
            view.getViewUsers().add(su);
        }

        return view.getViewUsers();
    }

    @MethodFilter
    public List<ShareUser> removeSharedUser(int userId) {
        View view = Common.getUser().getView();

        for (ShareUser su : view.getViewUsers()) {
            if (su.getUserId() == userId) {
                view.getViewUsers().remove(su);
                break;
            }
        }

        return view.getViewUsers();
    }

    @MethodFilter
    public void deleteViewShare() {
        User user = Common.getUser();
        new ViewDao().removeUserFromView(user.getView().getId(), user.getId());
    }

    //
    // /
    // / View editing
    // /
    //
    @MethodFilter
    public Map<String, Object> editInit() {
        Map<String, Object> result = new HashMap<String, Object>();
        User user = Common.getUser();

        // Users with which to share.
        result.put("shareUsers", getShareUsers(user));

        // Users already sharing with.
        result.put("viewUsers", user.getView().getViewUsers());

        // View component types
        List<KeyValuePair> components = new ArrayList<KeyValuePair>();
        for (ImplDefinition impl : ViewComponent.getImplementations())
            components.add(new KeyValuePair(impl.getName(), getMessage(impl.getNameKey())));
        result.put("componentTypes", components);

        // Available points
        List<DataPointVO> allPoints = new DataPointDao().getDataPoints(DataPointExtendedNameComparator.instance, false);
        List<DataPointBean> availablePoints = new ArrayList<DataPointBean>();
        for (DataPointVO dataPoint : allPoints) {
            if (Permissions.hasDataPointReadPermission(user, dataPoint))
                availablePoints.add(new DataPointBean(dataPoint));
        }
        result.put("pointList", availablePoints);

        return result;
    }

    @MethodFilter
    public ViewComponent addComponent(String componentName) {
        ViewComponent viewComponent = ViewComponent.newInstance(componentName);

        User user = Common.getUser();
        View view = user.getView();
        view.addViewComponent(viewComponent);
        viewComponent.validateDataPoint(user, false);

        return viewComponent;
    }

    @MethodFilter
    public void setViewComponentLocation(String viewComponentId, int x, int y) {
        getViewComponent(viewComponentId).setLocation(x, y);
    }

    @MethodFilter
    public void deleteViewComponent(String viewComponentId) {
        View view = Common.getUser().getView();
        view.removeViewComponent(getViewComponent(view, viewComponentId));
    }

    @MethodFilter
    public DwrResponseI18n setPointComponentSettings(String pointComponentId, int dataPointId, String name,
            boolean settable, String bkgdColorOverride, boolean displayControls) {
        DwrResponseI18n response = new DwrResponseI18n();
        PointComponent pc = (PointComponent) getViewComponent(pointComponentId);
        User user = Common.getUser();

        DataPointVO dp = new DataPointDao().getDataPoint(dataPointId);
        if (dp == null || !Permissions.hasDataPointReadPermission(user, dp))
            response.addContextualMessage("settingsPointList", "validate.required");
        else {
            pc.tsetDataPoint(dp);
            pc.setNameOverride(name);
            pc.setSettableOverride(settable && Permissions.hasDataPointSetPermission(user, dp));
            pc.setBkgdColorOverride(bkgdColorOverride);
            pc.setDisplayControls(displayControls);

            pc.validateDataPoint(user, false);
        }

        return response;
    }

    @MethodFilter
    public List<String> getViewComponentIds() {
        User user = Common.getUser();
        List<String> result = new ArrayList<String>();
        for (ViewComponent vc : user.getView().getViewComponents())
            result.add(vc.getId());
        return result;
    }

    /**
     * Allows the setting of a given data point. Overrides BaseDwr to resolve the point view id.
     * 
     * @param pointId
     * @param valueStr
     * @return
     */
    @MethodFilter
    public String setViewPoint(String viewComponentId, String valueStr) {
        User user = Common.getUser();
        View view = user.getView();
        DataPointVO point = view.findDataPoint(viewComponentId);

        if (point != null) {
            // Check that setting is allowed.
            int access = view.getUserAccess(user);
            if (!(access == ShareUser.ACCESS_OWNER || access == ShareUser.ACCESS_SET))
                throw new PermissionException("Not allowed to set this point", user);

            // Try setting the point.
            setPointImpl(point, valueStr, user);
        }

        return viewComponentId;
    }

    //
    // Save view component
    //
    @MethodFilter
    public void saveHtmlComponent(String viewComponentId, String content) {
        HtmlComponent c = (HtmlComponent) getViewComponent(viewComponentId);
        c.setContent(content);
    }

    @MethodFilter
    public DwrResponseI18n saveAnalogGraphicComponent(String viewComponentId, double min, double max,
            boolean displayText, String imageSetId) {
        DwrResponseI18n response = new DwrResponseI18n();

        // Validate
        if (min >= max)
            response.addContextualMessage("graphicRendererAnalogMin", "viewEdit.graphic.invalidMinMax");

        ImageSet imageSet = getImageSet(imageSetId);
        if (imageSet == null)
            response.addContextualMessage("graphicRendererAnalogImageSet", "viewEdit.graphic.missingImageSet");

        if (!response.getHasMessages()) {
            AnalogGraphicComponent c = (AnalogGraphicComponent) getViewComponent(viewComponentId);
            c.setMin(min);
            c.setMax(max);
            c.setDisplayText(displayText);
            c.tsetImageSet(imageSet);
            resetPointComponent(c);
        }

        return response;
    }

    @MethodFilter
    public DwrResponseI18n saveBinaryGraphicComponent(String viewComponentId, int zeroImage, int oneImage,
            boolean displayText, String imageSetId) {
        DwrResponseI18n response = new DwrResponseI18n();

        // Validate
        ImageSet imageSet = getImageSet(imageSetId);
        if (imageSet == null)
            response.addContextualMessage("graphicRendererBinaryImageSet", "viewEdit.graphic.missingImageSet");
        else {
            if (zeroImage == -1)
                response.addContextualMessage("graphicRendererBinaryImageSetZeroMsg",
                        "viewEdit.graphic.missingZeroImage");
            if (oneImage == -1)
                response.addContextualMessage("graphicRendererBinaryImageSetOneMsg", "viewEdit.graphic.missingOneImage");
        }

        if (!response.getHasMessages()) {
            BinaryGraphicComponent c = (BinaryGraphicComponent) getViewComponent(viewComponentId);
            c.tsetImageSet(imageSet);
            c.setZeroImage(zeroImage);
            c.setOneImage(oneImage);
            c.setDisplayText(displayText);
            resetPointComponent(c);
        }

        return response;
    }

    @MethodFilter
    public DwrResponseI18n saveDynamicGraphicComponent(String viewComponentId, double min, double max,
            boolean displayText, String dynamicImageId) {
        DwrResponseI18n response = new DwrResponseI18n();

        // Validate
        if (min >= max)
            response.addContextualMessage("graphicRendererDynamicMin", "viewEdit.graphic.invalidMinMax");

        DynamicImage dynamicImage = getDynamicImage(dynamicImageId);
        if (dynamicImage == null)
            response.addContextualMessage("graphicRendererDynamicImage", "viewEdit.graphic.missingDynamicImage");

        if (!response.getHasMessages()) {
            DynamicGraphicComponent c = (DynamicGraphicComponent) getViewComponent(viewComponentId);
            c.setMin(min);
            c.setMax(max);
            c.setDisplayText(displayText);
            c.tsetDynamicImage(dynamicImage);
            resetPointComponent(c);
        }

        return response;
    }

    @MethodFilter
    public DwrResponseI18n saveMultistateGraphicComponent(String viewComponentId, List<IntValuePair> imageStates,
            int defaultImage, boolean displayText, String imageSetId) {
        DwrResponseI18n response = new DwrResponseI18n();

        // Validate
        ImageSet imageSet = getImageSet(imageSetId);
        if (imageSet == null)
            response.addContextualMessage("graphicRendererMultistateImageSet", "viewEdit.graphic.missingImageSet");

        if (!response.getHasMessages()) {
            MultistateGraphicComponent c = (MultistateGraphicComponent) getViewComponent(viewComponentId);
            c.setImageStateList(imageStates);
            c.setDefaultImage(defaultImage);
            c.setDisplayText(displayText);
            c.tsetImageSet(imageSet);
            resetPointComponent(c);
        }

        return response;
    }

    @MethodFilter
    public DwrResponseI18n saveScriptComponent(String viewComponentId, String script) {
        DwrResponseI18n response = new DwrResponseI18n();

        // Validate
        if (StringUtils.isEmpty(script))
            response.addContextualMessage("graphicRendererScriptScript", "viewEdit.graphic.missingScript");

        if (!response.getHasMessages()) {
            ScriptComponent c = (ScriptComponent) getViewComponent(viewComponentId);
            c.setScript(script);
            resetPointComponent(c);
        }

        return response;
    }

    @MethodFilter
    public DwrResponseI18n saveSimplePointComponent(String viewComponentId, boolean displayPointName,
            String styleAttribute) {
        SimplePointComponent c = (SimplePointComponent) getViewComponent(viewComponentId);
        c.setDisplayPointName(displayPointName);
        c.setStyleAttribute(styleAttribute);
        resetPointComponent(c);

        return new DwrResponseI18n();
    }

    @MethodFilter
    public DwrResponseI18n saveThumbnailComponent(String viewComponentId, int scalePercent) {
        DwrResponseI18n response = new DwrResponseI18n();

        // Validate
        if (scalePercent < 1)
            response.addContextualMessage("graphicRendererThumbnailScalePercent", "viewEdit.graphic.invalidScale");

        if (!response.getHasMessages()) {
            ThumbnailComponent c = (ThumbnailComponent) getViewComponent(viewComponentId);
            c.setScalePercent(scalePercent);
            resetPointComponent(c);
        }

        return response;
    }

    @MethodFilter
    public DwrResponseI18n saveSimpleCompoundComponent(String viewComponentId, String name, String backgroundColour,
            List<KeyValuePair> childPointIds) {
        DwrResponseI18n response = new DwrResponseI18n();

        validateCompoundComponent(response, name);

        String leadPointId = null;
        for (KeyValuePair kvp : childPointIds) {
            if (SimpleCompoundComponent.LEAD_POINT.equals(kvp.getKey())) {
                leadPointId = kvp.getValue();
                break;
            }
        }

        if (StringUtils.parseInt(leadPointId, 0) <= 0)
            response.addContextualMessage("compoundPointSelect" + SimpleCompoundComponent.LEAD_POINT,
                    "dsEdit.validate.required");

        if (!response.getHasMessages()) {
            SimpleCompoundComponent c = (SimpleCompoundComponent) getViewComponent(viewComponentId);
            c.setName(name);
            c.setBackgroundColour(backgroundColour);
            saveCompoundPoints(c, childPointIds);
        }

        return response;
    }

    @MethodFilter
    public DwrResponseI18n saveImageChartComponent(String viewComponentId, String name, int width, int height,
            int durationType, int durationPeriods, List<KeyValuePair> childPointIds) {
        DwrResponseI18n response = new DwrResponseI18n();

        validateCompoundComponent(response, name);
        if (width < 1)
            response.addContextualMessage("imageChartWidth", "validate.greaterThanZero");
        if (height < 1)
            response.addContextualMessage("imageChartHeight", "validate.greaterThanZero");
        if (!Common.TIME_PERIOD_CODES.isValidId(durationType))
            response.addContextualMessage("imageChartDurationType", "validate.invalidValue");
        if (durationPeriods <= 0)
            response.addContextualMessage("imageChartDurationPeriods", "validate.greaterThanZero");

        if (!response.getHasMessages()) {
            ImageChartComponent c = (ImageChartComponent) getViewComponent(viewComponentId);
            c.setName(name);
            c.setWidth(width);
            c.setHeight(height);
            c.setDurationType(durationType);
            c.setDurationPeriods(durationPeriods);
            saveCompoundPoints(c, childPointIds);
        }

        return response;
    }

    @MethodFilter
    public DwrResponseI18n saveCompoundComponent(String viewComponentId, String name, List<KeyValuePair> childPointIds) {
        DwrResponseI18n response = new DwrResponseI18n();

        validateCompoundComponent(response, name);

        if (!response.getHasMessages()) {
            CompoundComponent c = (CompoundComponent) getViewComponent(viewComponentId);
            c.setName(name);
            saveCompoundPoints(c, childPointIds);
        }

        return response;
    }

    private void validateCompoundComponent(DwrResponseI18n response, String name) {
        if (StringUtils.isEmpty(name))
            response.addContextualMessage("compoundName", "dsEdit.validate.required");
    }

    private void saveCompoundPoints(CompoundComponent c, List<KeyValuePair> childPointIds) {
        User user = Common.getUser();

        for (KeyValuePair kvp : childPointIds) {
            int dataPointId = -1;
            try {
                dataPointId = Integer.parseInt(kvp.getValue());
            }
            catch (NumberFormatException e) {
                // no op
            }

            DataPointVO dp = new DataPointDao().getDataPoint(dataPointId);

            if (dp == null || !Permissions.hasDataPointReadPermission(user, dp))
                c.setDataPoint(kvp.getKey(), null);
            else
                c.setDataPoint(kvp.getKey(), dp);
            c.getChildComponent(kvp.getKey()).validateDataPoint(user, false);
        }
    }

    private void resetPointComponent(PointComponent c) {
        if (c.tgetDataPoint() != null)
            c.tgetDataPoint().resetLastValue();
    }

    private ImageSet getImageSet(String id) {
        return Common.ctx.getImageSet(id);
    }

    private DynamicImage getDynamicImage(String id) {
        return Common.ctx.getDynamicImage(id);
    }

    @MethodFilter
    public ViewComponent getViewComponent(String viewComponentId) {
        return getViewComponent(Common.getUser().getView(), viewComponentId);
    }

    private ViewComponent getViewComponent(View view, String viewComponentId) {
        for (ViewComponent viewComponent : view.getViewComponents()) {
            if (viewComponent.getId().equals(viewComponentId))
                return viewComponent;
        }
        return null;
    }
}
