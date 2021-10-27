use serde_json::Value;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct App {
    tables: Value,
}

#[wasm_bindgen]
impl App {
    pub async fn new() -> Self {
        let result = reqwest_wasm::get("https://localhost.katand.net:4431/tables")
            .await
            .unwrap()
            .text()
            .await
            .unwrap();
        Self {
            tables: serde_json::from_str(&result).unwrap(),
        }
    }

    pub fn get_table_name(&self) -> String {
        format!("{:?}", self.tables.to_string())
    }
}
