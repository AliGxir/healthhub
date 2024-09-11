# Generated by Selenium IDE
import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

class TestUpdateAppointment():
  def setup_method(self, method):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_updateAppointment(self):
    self.driver.get("http://localhost:5173/patient-page")
    self.driver.set_window_size(1920, 1055)
    self.driver.find_element(By.CSS_SELECTOR, ".four:nth-child(2) > .ui .ui:nth-child(1)").click()
    element = self.driver.find_element(By.CSS_SELECTOR, ".four:nth-child(2) > .ui .ui:nth-child(1)")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.NAME, "date").click()
    self.driver.find_element(By.NAME, "date").send_keys("2024-09-27T14:47")
    self.driver.find_element(By.CSS_SELECTOR, "body").click()
    self.driver.find_element(By.CSS_SELECTOR, ".field:nth-child(4) > .field").click()
    self.driver.find_element(By.CSS_SELECTOR, ".field:nth-child(4) > .field").click()
    self.driver.find_element(By.NAME, "billing_id").click()
    self.driver.find_element(By.NAME, "billing_id").send_keys("3")
    self.driver.find_element(By.CSS_SELECTOR, ".ui:nth-child(7)").click()
  
